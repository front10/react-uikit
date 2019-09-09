import React from "react";
import PropTypes from "prop-types";
import { useStyles } from "../../helpers";
import findInputs from "./helpers/findInputs";
import useValidChildren from "./hooks/useValidChildren";
import useFormValid from "./hooks/useFormValid";
import { Container, Spinner } from "../";

class Form extends React.Component {
  state = {
    children: null
  };

  componentDidMount = () => {
    this.setChildren();
  };

  componentDidUpdate = prevProps => {
    this.onUpdate(prevProps);
  };

  onUpdate = prevProps => {
    const { children } = this.props;
    if (children !== prevProps.children) this.setChildren();
  };

  setChildren = () => {
    const { children, onValid } = this.props;
    const validate = findInputs(children);
    if (validate.length === 0) onValid({ valid: true });
    const handleValid = useFormValid({ onValid, validate });
    this.setState({
      children: useValidChildren({ children, handleValid })
    });
  };

  render = () => {
    const { layout, id, loading } = this.props;
    const { children } = this.state;
    let cls = `uk-position-relative ${useStyles(this.props)}`;
    if (layout) cls += ` uk-form-${layout}`;
    cls = cls || null;

    return (
      <form id={id} className={cls}>
        {loading && <Form.Loader />}
        {children}
      </form>
    );
  };
}

Form.Loader = () => (
  <Container
    width="1-1"
    height="1-1"
    flex="middle"
    className="uk-position-absolute uk-form-loading"
  >
    <Container width="1-1" textAlign="center">
      <Spinner />
      <Container>Loading...</Container>
    </Container>
  </Container>
);

Form.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  id: PropTypes.string,
  layout: PropTypes.oneOf([null, "stacked", "horizontal", "label", "controls"]),
  loading: PropTypes.bool,
  onValid: PropTypes.func
};

Form.defaultProps = {
  children: null,
  id: null,
  layout: null,
  loading: false,
  onValid: () => {}
};

export default Form;
