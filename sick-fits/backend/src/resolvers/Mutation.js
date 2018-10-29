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
  },
  updateItem(parent, args, ctx, info){
    //take copy of the updates
    const updates= {...args};
    //remove the id from the update, we don't want to chage the id
    delete updates.id
    return ctx.db.mutation.updateItem({
      data:updates,
      where:{
        id:args.id,
      }
    }, info);
  },
  async deleteItem(parent, args, ctx, info){
    const where = {id: args.id};
    // find item
    const item = await ctx.db.query.item({where}, `{id title}`);
    // check if the ownder has permissions to delete it
    //delete it
    return ctx.db.mutation.deleteItem({where}, info)
  }

};

module.exports = Mutations;
