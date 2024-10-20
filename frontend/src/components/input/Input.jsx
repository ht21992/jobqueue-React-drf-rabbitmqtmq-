import React from "react";

const Input = ({
  type = "text",
  classes = "",
  onChange = () => null,
  ...rest
}) => {
  return (
    <input
      type={type}
      className={classes}
      onChange={onChange}
      {...rest}
    />
  );
};

export default Input;
