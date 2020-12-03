const pieceMoveObj = {
    pawn: {
        direction: ["forward"],
        total: 2,
    },
    rook: {
        direction: ["forward", "backward", "left", "right"],
        total: "unlimited"
    },
    knight: {
        direction: ["foward-left", "forward-right", "left-backward", "left-forward", "backward-left", "backward-right", "right-forward", "right-backward"],
        total: {
            primary: 2,
            secondary: 1,
        }
    },
    bishop: {
        direction: ["diagonal-forward-left", "diagonal-forward-right", "diagonal-backward-left", "diagonal-backward-right"],
        total: {
            primary: "unlimited",
            secondary: "unlimited",//must match primary
        }
    },
    queen: {
        direction: ["forward", "backward", "left", "right", "diagonal-forward-left", "diagonal-forward-right", "diagonal-backward-left", "diagonal-backward-right"],
        total: {
            primary: "unlimited",
            secondary: "unlimited",//must match primary
        },
    },
    king: {
        direction: ["forward", "backward", "left", "right", "diagonal-forward-left", "diagonal-forward-right", "diagonal-backward-left", "diagonal-backward-right"],
        total: {
            primary: 1,
            secondary: 1,
        },
    },
}

const directionConverterObj = {
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

export {pieceMoveObj, directionConverterObj};