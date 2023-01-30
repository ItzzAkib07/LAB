import React from 'react';

function Popup(props) {
                <style>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css" />
                </style>
    return (props.trigger) ? (


        <div className='popup'>
            <div className='popup-inner'>
                <button className='close-btn' onClick={() => props.setTrigger(false)}><i className="fa-solid fa-xmark"></i></button>
                {props.children}
            </div>
        </div>
    ) : "";
}

export default Popup;