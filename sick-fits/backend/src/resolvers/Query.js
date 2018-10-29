const { forwardTo }=require('prisma-binding');

const Query = {
    items: forwardTo('db'),
    item: forwardTo('db'),
    itemsConnection: forwardTo('db'),
//Below is a custom reslover
    //   async items(parent, args, ctx, info) {
//       console.log("HEEEY")
//     // return ctx.db.query.item(); as a PROMISE, which works but delete other lines and remove "async"
//     const items = await ctx.db.query.items();
//     return items;
//   }
};

module.exports = Query;
