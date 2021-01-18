import { useState, useEffect } from 'react';
import { returnPieceEmoji } from '../../../helper/boardHelp.js';

export default function PawnPromotion({ pawnPromotionGraveyard, updatePieceToPromotePawnTo, resolvePawnPromotion, authInfo, db }) {

    let [pawnPromotionNumber, setPawnPromotionNumber] = useState('');

    function choosePiece(e) {
        updatePieceToPromotePawnTo(e.target.dataset.name);
        resolvePawnPromotion();
    }
    function options() {
        const optionTags = [];
        const potentialPieces = [{ name: `rook${pawnPromotionNumber}` }, { name: `knight${pawnPromotionNumber}` }, { name: `bishop${pawnPromotionNumber}` }, { name: `queen${pawnPromotionNumber}` }];
        for (const piece of potentialPieces) {//pawnPromotionGraveyardFilteredOutDuplicateNames
            function classVal() {
                let classVal = "piece-image ";
                classVal += `${authInfo.color}-piece `;
                return classVal;
            }
            const tag =
                <img className={classVal()} data-name={piece.name} onClick={choosePiece} src={returnPieceEmoji(piece.name)} key={Math.random()} />
            optionTags.push(tag);
        }
        return optionTags;
    }

    useEffect(() => {
        db.ref(`matches/${authInfo.url}/${authInfo.user}/pawnPromotionNumber`).orderByKey().on('value', (e) => {
            setPawnPromotionNumber(e.val());
        });
    });

    return (
        <>
            <div className="pawn-promotion-container">
                {/* <div className='pawn-promotion-exit-button'>
                    <div onClick={resolvePawnPromotion}>X</div>
                </div> */}
                <div className={`pawn-promotion-grid-container pawn-promotion-grid-container-color-${authInfo.color}`} >
                    {options()}
                </div>
                {/* <div className='pawn-promotion-title'>Promote pawn</div> */}
            </div>
        </>
    )
}