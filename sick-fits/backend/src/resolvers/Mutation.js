const Mutations = {
  //TODO: check if they are logged in
  //we use async await instead of promise to have access to time
  async createItem(parent, args, ctx, info) {
    const item = await ctx.db.mutation.createItem({
      data: {
        ...args
      }
    },info);
    return item;
  }
};
// createDog(parent, args, ctx, info){
//     global.dogs = global.dogs || [];
//     const newDog = {name: args.name}
//     global.dogs.push(newDog);
//     return Dog;
// },
module.exports = Mutations;
