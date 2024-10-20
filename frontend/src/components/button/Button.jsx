import React from "react";

const Button = ({
  onClick = () => null,
  classes = "btn",
  type = "button",
  text = "Button",
  ...rest
}) => {
  return (
    <button type={type} className={classes} onClick={onClick} {...rest}>
      {text}
    </button>
  );
};

export default Button;
