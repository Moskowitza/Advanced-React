const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomBytes } = require("crypto");
const { promisify } = require("util");
const { transport, makeANiceEmail } = require("../mail");

const Mutations = {
  async createItem(parent, args, ctx, info) {
    //TODO: check if they are logged in
    if (!ctx.request.userId) {
      throw new Error("you must be logged in to do that");
    }
    //we use async await instead of promise to have access to time
    const item = await ctx.db.mutation.createItem(
      {
        data: {
          // This is how we create a relationship between user and item
          user: {
            connect: {
              id: ctx.request.userId
            }
          },
          ...args
        }
      },
      info
    );

    console.log(item);

    return item;
  },
  updateItem(parent, args, ctx, info) {
    //take copy of the updates
    const updates = { ...args };
    //remove the id from the update, we don't want to change the id, just updating here
    delete updates.id;
    //run updateItem method
    return ctx.db.mutation.updateItem(
      {
        data: updates,
        where: {
          id: args.id
        }
      },
      info
    );
  },
  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };
    // find item
    const item = await ctx.db.query.item({ where }, `{id title}`);
    // check if the owner has permissions to delete it
    // TODO
    //delete it
    return ctx.db.mutation.deleteItem({ where }, info);
  },
  async signup(parent, args, ctx, info) {
    // lower case email address
    args.email = args.email.toLowerCase();
    //hash password
    const password = await bcrypt.hash(args.password, 10);
    //create a new user
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ["USER"] }
        }
      },
      info
    );
    //create JWT and log in now
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    //we set the jwt as a cookie on the response
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 //1 year cookie
    });
    //return user to the browser
    return user;
  },
  async signin(parent, { email, password }, ctx, info) {
    //1: Check if user with email exists
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error(`No such user found for email ${email}`);
    }
    //2: check if password is correct
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error(`invalid password`);
    }
    //3: generate JWT
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    //4: Set cookie with JWT
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 //1 year cookie
    });
    //5: return user
    return user;
  },
  signout(parent, args, ctx, info) {
    ctx.response.clearCookie("token");
    return { message: "Signed out" };
  },
  async requestReset(parent, args, ctx, info) {
    //1:check if this is a real user
    const user = await ctx.db.query.user({ where: { email: args.email } });
    if (!user) {
      throw new Error(`No such user found for email ${args.email}`);
    }
    // 2. Set a reset token and expiry on that user
    const randomBytesPromiseified = promisify(randomBytes);
    const resetToken = (await randomBytesPromiseified(20)).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
    const res = await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken, resetTokenExpiry }
    });
    // console.log(res)...don't log user info, even to the back end
    //3Email link

    const mailRes = await transport.sendMail({
      from: "aaronmoskowitz@gmail.com",
      to: user.email,
      subject: "Your Password Reset",
      html: makeANiceEmail(
        `Your password reset token is here! \n\n <a href="${
          process.env.FRONTEND_URL
        }/reset?resetToken=${resetToken}">Click here to Reset</a>`
      )
    });
    return { message: "Thanks!" };
  },
  async resetPassword(parent, args, ctx, info) {
    //1. Check if passwords match
    if (args.password !== args.confirmPassword) {
      throw new Error("Passwords don't match");
    }
    //2. Check reset token, you'll need to search all users for a reset token
    //3. AND Check if it's expired or not
    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now() - 360000
      }
    });
    if (!user) {
      throw new Error("this reset is invalid or expired");
    }
    //4. Hash new password
    const password = await bcrypt.hash(args.password, 10);
    //5. Save new password to user and remove reset token fields
    const updatedUser = await ctx.db.mutation.updateUser({
      where: {
        email: user.email
      },
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null
      }
    });
    //6. Generate JWT
    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
    //7. Set JWT cookie
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 //1 year cookie
    });
    //8. Return the new user
    return updatedUser;
  }
};

module.exports = Mutations;
