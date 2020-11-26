let secondBigObj = { //have a demo like this ready in db (that can't be deleted) that we build from
    "user1": {
        signedIn: false,
        moved: 0,
        white: true,
        canMove: false,
        piecesMoved: [], //could be 3
        casualty: null,//name
        pawnReincarnate: null,//name
        quit: false,
        rematch: false,
        pieces: {
            "pawn1": {
                white: true,
                rowPosition: '7/8',
                columnPosition: '1/2',
                alive: true,
            },
            "pawn2": {
                white: true,
                rowPosition: '7/8',
                columnPosition: '2/3',
                alive: true,
            },
            "pawn3": {
                white: true,
                rowPosition: '7/8',
                columnPosition: '3/4',
                alive: true,
            },
            "pawn4": {
                white: true,
                rowPosition: '7/8',
                columnPosition: '4/5',
                alive: true,
            },
            "pawn5": {
                white: true,
                rowPosition: '7/8',
                columnPosition: '5/6',
                alive: true,
            },
            "pawn6": {
                white: true,
                rowPosition: '7/8',
                columnPosition: '6/7',
                alive: true,
            },
            "pawn7": {
                white: true,
                rowPosition: '7/8',
                columnPosition: '7/8',
                alive: true,
            },
            "pawn8": {
                white: true,
                rowPosition: '7/8',
                columnPosition: '8/9',
                alive: true,
            },
            "rook1": {
                white: true,
                rowPosition: '8/9',
                columnPosition: '1/2',
                alive: true,
                neverMoved: true,
            },
            "rook2": {
                white: true,
                rowPosition: '8/9',
                columnPosition: '8/9',
                alive: true,
                neverMoved: true,
            },
            "knight1": {
                white: true,
                rowPosition: '8/9',
                columnPosition: '2/3',
                alive: true,
            },
            "knight2": {
                white: true,
                rowPosition: '8/9',
                columnPosition: '7/8',
                alive: true,
            },
            "bishop1": {
                white: true,
                rowPosition: '8/9',
                columnPosition: '3/4',
                alive: true,
            },
            "bishop2": {
                white: true,
                rowPosition: '8/9',
                columnPosition: '6/7',
                alive: true,
            },
            "king": {
                white: true,
                rowPosition: '8/9',
                columnPosition: '5/6',
                alive: true,
                neverMoved: true
            },
            "queen": {
                white: true,
                rowPosition: '8/9',
                columnPosition: '4/5',
                alive: true,
            },
        },
    },
    user2: {
        signedIn: false,
        moved: 0,
        white: false,
        canMove: false,
        piecesMoved: [], //could be 3
        casualty: null,//name
        pawnReincarnate: null,//name
        quit: false,
        rematch: false,
        pieces: {
            "pawn1": {
                white: false,
                rowPosition: '2/3',
                columnPosition: '8/9',
                alive: true,
            },
            "pawn2": {
                white: false,
                rowPosition: '2/3',
                columnPosition: '7/8',
                alive: true,
            },
            "pawn3": {
                white: false,
                rowPosition: '2/3',
                columnPosition: '6/7',
                alive: true,
            },
            "pawn4": {
                white: false,
                rowPosition: '2/3',
                columnPosition: '5/6',
                alive: true,
            },
            "pawn5": {
                white: false,
                rowPosition: '2/3',
                columnPosition: '4/5',
                alive: true,
            },
            "pawn6": {
                white: false,
                rowPosition: '2/3',
                columnPosition: '3/4',
                alive: true,
            },
            "pawn7": {
                white: false,
                rowPosition: '2/3',
                columnPosition: '2/3',
                alive: true,
            },
            "pawn8": {
                white: false,
                rowPosition: '2/3',
                columnPosition: '1/2',
                alive: true,
            },
            "rook1": {
                white: false,
                rowPosition: '1/2',
                columnPosition: '8/9',
                alive: true,
                neverMoved: true,
            },
            "rook2": {
                white: false,
                rowPosition: '1/2',
                columnPosition: '1/2',
                alive: true,
                neverMoved: true,
            },
            "knight1": {
                white: false,
                rowPosition: '1/2',
                columnPosition: '7/8',
                alive: true,
            },
            "knight2": {
                white: false,
                rowPosition: '1/2',
                columnPosition: '2/3',
                alive: true,
            },
            "bishop1": {
                white: false,
                rowPosition: '1/2',
                columnPosition: '6/7',
                alive: true,
            },
            "bishop2": {
                white: false,
                rowPosition: '1/2',
                columnPosition: '3/4',
                alive: true,
            },
            "king": {
                white: false,
                rowPosition: '1/2',
                columnPosition: '5/6',
                alive: true,
                neverMoved: true
            },
            "queen": {
                white: false,
                rowPosition: '1/2',
                columnPosition: '4/5',
                alive: true,
            },
        },
    },
}

export default secondBigObj;

// db.ref('matches/template2').set(secondBigObj);