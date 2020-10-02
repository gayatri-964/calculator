function _extends() {_extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};return _extends.apply(this, arguments);}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}const PointTarget = ReactPoint.PointTarget;

class AutoScalingText extends React.Component {constructor(...args) {super(...args);_defineProperty(this, "state",
    {
      scale: 1 });}


  componentDidUpdate() {
    const { scale } = this.state;

    const node = this.node;
    const parentNode = node.parentNode;

    const availableWidth = parentNode.offsetWidth;
    const actualWidth = node.offsetWidth;
    const actualScale = availableWidth / actualWidth;

    if (scale === actualScale)
    return;

    if (actualScale < 1) {
      this.setState({ scale: actualScale });
    } else if (scale < 1) {
      this.setState({ scale: 1 });
    }
  }

  render() {
    const { scale } = this.state;

    return (
      React.createElement("div", {
        className: "auto-scaling-text",
        style: { transform: `scale(${scale},${scale})` },
        ref: node => this.node = node },
      this.props.children));

  }}


class CalculatorDisplay extends React.Component {
  render() {
    const { value, ...props } = this.props;

    const language = navigator.language || 'en-US';
    let formattedValue = parseFloat(value).toLocaleString(language, {
      useGrouping: true,
      maximumFractionDigits: 6 });


    const match = value.match(/\.\d*?(0*)$/);

    if (match)
    formattedValue += /[1-9]/.test(match[0]) ? match[1] : match[0];

    return (
      React.createElement("div", _extends({}, props, { className: "calculator-display" }),
      React.createElement(AutoScalingText, null, formattedValue)));


  }}


class CalculatorKey extends React.Component {
  render() {
    const { onPress, className, ...props } = this.props;

    return (
      React.createElement(PointTarget, { onPoint: onPress },
      React.createElement("button", _extends({ className: `calculator-key ${className}` }, props))));


  }}


const CalculatorOperations = {
  '/': (prevValue, nextValue) => prevValue / nextValue,
  '*': (prevValue, nextValue) => prevValue * nextValue,
  '+': (prevValue, nextValue) => prevValue + nextValue,
  '-': (prevValue, nextValue) => prevValue - nextValue,
  '=': (prevValue, nextValue) => nextValue };


class Calculator extends React.Component {constructor(...args) {super(...args);_defineProperty(this, "state",
    {
      value: null,
      displayValue: '0',
      operator: null,
      waitingForOperand: false });_defineProperty(this, "handleKeyDown",

    event => {
      let { key } = event;

      if (key === 'Enter')
      key = '=';

      if (/\d/.test(key)) {
        event.preventDefault();
        this.inputDigit(parseInt(key, 10));
      } else if (key in CalculatorOperations) {
        event.preventDefault();
        this.performOperation(key);
      } else if (key === '.') {
        event.preventDefault();
        this.inputDot();
      } else if (key === '%') {
        event.preventDefault();
        this.inputPercent();
      } else if (key === 'Backspace') {
        event.preventDefault();
        this.clearLastChar();
      } else if (key === 'Clear') {
        event.preventDefault();

        if (this.state.displayValue !== '0') {
          this.clearDisplay();
        } else {
          this.clearAll();
        }
      }
    });}clearAll() {this.setState({ value: null, displayValue: '0', operator: null, waitingForOperand: false });}clearDisplay() {this.setState({ displayValue: '0' });}clearLastChar() {const { displayValue } = this.state;this.setState({ displayValue: displayValue.substring(0, displayValue.length - 1) || '0' });}toggleSign() {const { displayValue } = this.state;const newValue = parseFloat(displayValue) * -1;this.setState({ displayValue: String(newValue) });}inputPercent() {const { displayValue } = this.state;const currentValue = parseFloat(displayValue);if (currentValue === 0) return;const fixedDigits = displayValue.replace(/^-?\d*\.?/, '');const newValue = parseFloat(displayValue) / 100;this.setState({ displayValue: String(newValue.toFixed(fixedDigits.length + 2)) });}inputDot() {const { displayValue } = this.state;if (!/\./.test(displayValue)) {this.setState({ displayValue: displayValue + '.', waitingForOperand: false });}}inputDigit(digit) {const { displayValue, waitingForOperand } = this.state;if (waitingForOperand) {this.setState({ displayValue: String(digit), waitingForOperand: false });} else {this.setState({ displayValue: displayValue === '0' ? String(digit) : displayValue + digit });}}performOperation(nextOperator) {const { value, displayValue, operator } = this.state;const inputValue = parseFloat(displayValue);if (value == null) {this.setState({ value: inputValue });} else if (operator) {const currentValue = value || 0;const newValue = CalculatorOperations[operator](currentValue, inputValue);this.setState({ value: newValue, displayValue: String(newValue) });}this.setState({ waitingForOperand: true, operator: nextOperator });}

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  render() {
    const { displayValue } = this.state;

    const clearDisplay = displayValue !== '0';
    const clearText = clearDisplay ? 'C' : 'AC';

    return (
      React.createElement("div", { className: "pt-16 p-5 pb-0 text-white text-right text-5xl bg-purple-800" },
      React.createElement(CalculatorDisplay, { value: displayValue }),
      React.createElement("div", { className: "calculator-keypad" },
      React.createElement("div", { className: "input-keys" },
      React.createElement("div", { className: "flex items-stretch bg-purple-900 h-24 mb-5" },
      React.createElement("div", { className: "flex-1 px-2 py-2 justify-center flex items-center text-white text-2xl font-semibold" },
      React.createElement(CalculatorKey, { className: "rounded-full h-20 w-20 flex items-center bg-orange-500 justify-center shadow-lg border-2 border-purple-700 hover:border-2 hover:border-gray-500 focus:outline-none", onPress: () => clearDisplay ? this.clearDisplay() : this.clearAll() }, clearText)),
      React.createElement("div", { className: "flex-1 px-2 py-2 justify-center flex items-center text-white text-2xl font-semibold" },
      React.createElement(CalculatorKey, { className: "rounded-full h-20 w-20 flex items-center bg-orange-500 justify-center shadow-lg border-2 border-purple-700 hover:border-2 hover:border-gray-500 focus:outline-none", onPress: () => this.toggleSign() }, "\xB1")),
      React.createElement("div", { className: "flex-1 px-2 py-2 justify-center flex items-center text-white text-2xl font-semibold" },
      React.createElement(CalculatorKey, { className: "rounded-full h-20 w-20 flex items-center bg-orange-500 justify-center shadow-lg border-2 border-purple-700 hover:border-2 hover:border-gray-500 focus:outline-none", onPress: () => this.inputPercent() }, "%")),
      
      React.createElement("div", { className: "flex-1 px-2 py-2 justify-center flex items-center text-white text-2xl font-semibold" },
      React.createElement(CalculatorKey, { className: "rounded-full h-20 w-20 flex items-center bg-orange-500 justify-center shadow-lg border-2 border-purple-700 hover:border-2 hover:border-gray-500 focus:outline-none", onPress: () => this.performOperation('/') }, "\xF7"))),
      
      React.createElement("div", { className: "flex items-stretch bg-purple-900 h-24 mb-4" },

      
      React.createElement("div", { className: "flex-1 px-2 py-2 justify-center flex items-center text-white text-2xl font-semibold" },
      React.createElement(CalculatorKey, { className: "rounded-full h-20 w-20 flex items-center bg-purple-800 justify-center shadow-lg border-2 border-purple-700 hover:border-2 hover:border-gray-500 focus:outline-none", onPress: () => this.inputDigit(7) }, "7")),
      React.createElement("div", { className: "flex-1 px-2 py-2 justify-center flex items-center text-white text-2xl font-semibold" },
      React.createElement(CalculatorKey, { className: "rounded-full h-20 w-20 flex items-center bg-purple-800 justify-center shadow-lg border-2 border-purple-700 hover:border-2 hover:border-gray-500 focus:outline-none", onPress: () => this.inputDigit(8) }, "8")),
      
      React.createElement("div", { className: "flex-1 px-2 py-2 justify-center flex items-center text-white text-2xl font-semibold" },
      React.createElement(CalculatorKey, { className: "rounded-full h-20 w-20 flex items-center bg-purple-800 justify-center shadow-lg border-2 border-purple-700 hover:border-2 hover:border-gray-500 focus:outline-none", onPress: () => this.inputDigit(9) }, "9")),
      React.createElement("div", { className: "flex-1 px-2 py-2 justify-center flex items-center text-white text-2xl font-semibold" },
      React.createElement(CalculatorKey, { className: "rounded-full h-20 w-20 flex items-center bg-orange-500 justify-center shadow-lg border-2 border-purple-700 hover:border-2 hover:border-gray-500 focus:outline-none", onPress: () => this.performOperation('*') }, "\xD7")))),
      
      React.createElement("div", { className: "flex items-stretch bg-purple-900 h-24 mb-4" },
      React.createElement("div", { className: "flex-1 px-2 py-2 justify-center flex items-center text-white text-2xl font-semibold" },
      React.createElement(CalculatorKey, { className: "rounded-full h-20 w-20 flex items-center bg-purple-800 justify-center shadow-lg border-2 border-purple-700 hover:border-2 hover:border-gray-500 focus:outline-none", onPress: () => this.inputDigit(4) }, "4")),
      React.createElement("div", { className: "flex-1 px-2 py-2 justify-center flex items-center text-white text-2xl font-semibold" },
      React.createElement(CalculatorKey, { className: "rounded-full h-20 w-20 flex items-center bg-purple-800 justify-center shadow-lg border-2 border-purple-700 hover:border-2 hover:border-gray-500 focus:outline-none", onPress: () => this.inputDigit(5) }, "5")),
      React.createElement("div", { className: "flex-1 px-2 py-2 justify-center flex items-center text-white text-2xl font-semibold" },
      React.createElement(CalculatorKey, { className: "rounded-full h-20 w-20 flex items-center bg-purple-800 justify-center shadow-lg border-2 border-purple-700 hover:border-2 hover:border-gray-500 focus:outline-none", onPress: () => this.inputDigit(6) }, "6")),
      React.createElement("div", { className: "flex-1 px-2 py-2 justify-center flex items-center text-white text-2xl font-semibold" },
      React.createElement(CalculatorKey, { className: "rounded-full h-20 w-20 flex items-center bg-orange-500 justify-center shadow-lg border-2 border-purple-700 hover:border-2 hover:border-gray-500 focus:outline-none", onPress: () => this.performOperation('-') }, "\u2212"))),

      React.createElement("div", { className: "flex items-stretch bg-purple-900 h-24 mb-4" },
      React.createElement("div", { className: "flex-1 px-2 py-2 justify-center flex items-center text-white text-2xl font-semibold" },
      React.createElement(CalculatorKey, { className: "rounded-full h-20 w-20 flex items-center bg-purple-800 justify-center shadow-lg border-2 border-purple-700 hover:border-2 hover:border-gray-500 focus:outline-none", onPress: () => this.inputDigit(1) }, "1")),
      React.createElement("div", { className: "flex-1 px-2 py-2 justify-center flex items-center text-white text-2xl font-semibold" },
      React.createElement(CalculatorKey, { className: "rounded-full h-20 w-20 flex items-center bg-purple-800 justify-center shadow-lg border-2 border-purple-700 hover:border-2 hover:border-gray-500 focus:outline-none", onPress: () => this.inputDigit(2) }, "2")),
      React.createElement("div", { className: "flex-1 px-2 py-2 justify-center flex items-center text-white text-2xl font-semibold" },
      React.createElement(CalculatorKey, { className: "rounded-full h-20 w-20 flex items-center bg-purple-800 justify-center shadow-lg border-2 border-purple-700 hover:border-2 hover:border-gray-500 focus:outline-none", onPress: () => this.inputDigit(3) }, "3")),
      React.createElement("div", { className: "flex-1 px-2 py-2 justify-center flex items-center text-white text-2xl font-semibold" },
      React.createElement(CalculatorKey, { className: "rounded-full h-20 w-20 flex items-center bg-orange-500 justify-center shadow-lg border-2 border-purple-700 hover:border-2 hover:border-gray-500 focus:outline-none", onPress: () => this.performOperation('+') }, "+"))),


      React.createElement("div", { className: "flex items-stretch bg-purple-900 h-24 mb-4" },
      
      React.createElement("div", { className: "flex-1 px-2 py-2 justify-center flex items-center text-white text-2xl font-semibold" },
      React.createElement(CalculatorKey, { className: "rounded-full h-20 w-20 flex items-center bg-orange-500 justify-center shadow-lg border-2 border-purple-700 hover:border-2 hover:border-gray-500 focus:outline-none", onPress: () => this.performOperation('=') }, "=")),
      React.createElement("div", { className: "flex-1 px-2 py-2 justify-center flex items-center text-white text-2xl font-semibold" },
      React.createElement(CalculatorKey, { className: "rounded-full h-20 w-20 flex items-center bg-purple-800 justify-center shadow-lg border-2 border-purple-700 hover:border-2 hover:border-gray-500 focus:outline-none", onPress: () => this.inputDigit(0) }, "0")),
      React.createElement("div", { className: "flex-1 px-2 py-2 justify-center flex items-center text-white text-2xl font-semibold" },
      React.createElement(CalculatorKey, { className: "rounded-full h-20 w-20 flex items-center bg-purple-800 justify-center shadow-lg border-2 border-purple-700 hover:border-2 hover:border-gray-500 focus:outline-none", onPress: () => this.inputDot() }, "\u25CF")),
      React.createElement("div", { className: "flex-1 px-2 py-2 justify-center flex items-center text-white text-2xl font-semibold" },
      React.createElement(CalculatorKey, { className: "rounded-full h-20 w-20 flex items-center bg-orange-500 justify-center shadow-lg border-2 border-purple-700 hover:border-2 hover:border-gray-500 focus:outline-none", onPress: () => this.performOperation('=') }, "="))))));




  }}


ReactDOM.render(
React.createElement(Calculator, null),
document.getElementById('app'));