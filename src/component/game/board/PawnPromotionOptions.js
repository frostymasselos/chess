import {returnPieceEmoji} from '../../../helper/boardHelp.js';

export default function pawnPromotion({pawnPromotionGraveyard, updatePieceToPromotePawnTo, resolvePawnPromotion, authInfo}) {

    function choosePiece(e) {
        updatePieceToPromotePawnTo(e.target.dataset.name);
        resolvePawnPromotion();
    }
    function options() {
        //filter out duplicates
        const optionTags = [];
        const pawnPromotionGraveyardFilteredOutDuplicateNames = [];
        for (const deadPiece of pawnPromotionGraveyard) {
            if (pawnPromotionGraveyardFilteredOutDuplicateNames.some((filteredDeadPiece) => deadPiece.name.replace(/\d/, '') === filteredDeadPiece.name.replace(/\d/, ''))) {
                continue;
            }
            pawnPromotionGraveyardFilteredOutDuplicateNames.push(deadPiece);
        }
        console.log(pawnPromotionGraveyardFilteredOutDuplicateNames);
        //each item of filtered made into GI, 2x2. class="promotion-piece"
        for (const piece of pawnPromotionGraveyardFilteredOutDuplicateNames) { 
            const tag = 
                <div data-name={piece.name} key={Math.random()} onClick={choosePiece}>
                    {returnPieceEmoji(piece.name.replace(/\d/, ''))}
                </div>;
            optionTags.push(tag);
        }
        return optionTags;
    }

    return (
        <>
            <div className='pawn-promotion-exit-button'>
                <div onClick={resolvePawnPromotion}>X</div>
            </div>
            <div className={`pawn-promotion-grid-container pawn-promotion-grid-container-color-${authInfo.color}`} >
                {options()}
            </div>
            {/* <div className='pawn-promotion-title'>Promote pawn</div> */}
        </>
    )
}