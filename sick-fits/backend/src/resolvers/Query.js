const { forwardTo } = require("prisma-binding");
const { hasPermission } = require("../utils");
const Query = {
  items: forwardTo("db"),
  item: forwardTo("db"),
  itemsConnection: forwardTo("db"),
  me(parent, args, ctx, info) {
    //this is also a Promise
    // Check if user is logged in use ctx.request
    if (!ctx.request.userId) {
      return null; //return null so we can run query and have the site run when user is not logged in
    }
    return ctx.db.query.user(
      {
        where: { id: ctx.request.userId }
      },
      info
    );
  },
  async users(parent, args, ctx, info) {
    //1 check to see if user is logged in
    if (!ctx.request.userId) {
      throw new Error("must be logged in");
    }
    //2 check to see if they have permissions
    hasPermission(ctx.request.user, ["ADMIN", "PERMISSIONUPDATE"]);
    // If it user exists and has permissions is true
    return ctx.db.query.users({}, info);
  }
};

module.exports = Query;
