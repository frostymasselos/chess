const directionConverter = {
    white: {
        forward: 8, //check to see not above 63
        backward: -8, //check to see not above 63
        left: -1, //check to see not below 0, can't be multiple of 8. 
        right: 1, //check to see not above 63, can't be multiple of 7. 
    },
    black: {
        forward: -8,
        backward: 8,
        left: 1, //check to see not above 63, can't be multiple of 7.
        right: -1 //check to see not below 0, can't be multiple of 8. 
    },
};

export default directionConverter;