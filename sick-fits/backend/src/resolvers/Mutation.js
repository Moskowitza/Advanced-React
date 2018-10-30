const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Mutations = {
  //TODO: check if they are logged in
  //we use async await instead of promise to have access to time
  async createItem(parent, args, ctx, info) {
    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args
        }
      },
      info
    );
    return item;
  },
  updateItem(parent, args, ctx, info) {
    //take copy of the updates
    const updates = { ...args };
    //remove the id from the update, we don't want to chage the id
    delete updates.id;
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
    // check if the ownder has permissions to delete it
    //delete it
    return ctx.db.mutation.deleteItem({ where }, info);
  },
  async signup(parent, args, ctx, info) {
    // lower case email address
    args.email = args.email.toLowerCase();
    //hash password
    const password = await bcrypt.hash(args.password, 10);
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
    //create JWT and log in
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    //we set the jwt as a cookie on the response
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 //1 year cookie
    });
    //return user to the browser
    return user;
  }
};

module.exports = Mutations;
