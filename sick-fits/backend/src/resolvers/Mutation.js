const Mutations = {
    createDog(parent, args, ctx, info){
        global.dogs = global.dogs || [];
        const newDog = {name: args.name}
        global.dogs.push(newDog);
        return Dog;
    },
};

module.exports = Mutations;
