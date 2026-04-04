import React from 'react'

function Alert(props) {
    const capitalize = (word) => {
        if (word === "danger") {
            word = "error";
        }
        const lower = word.toLowerCase();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
    }
    return (
    <div style={{ height: '50px' }}>
        {props.alert && (
            <div 
                className={`alert alert-${props.alert.type} alert-dismissible fade show`} 
                role="alert"
                // Inline style to force it to the top
                style={{ 
                    position: 'fixed', 
                    top: '60px', 
                    left: '50%', 
                    transform: 'translateX(-50%)', 
                    zIndex: 9999, // Higher than Bootstrap's 1055
                    width: '90%',
                    maxWidth: '600px'
                }}
            >
                <strong>{capitalize(props.alert.type)}</strong>:{" " + props.alert.msg}
            </div>
        )}
    </div>
)
}

export default Alert