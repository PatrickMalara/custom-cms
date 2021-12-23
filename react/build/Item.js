var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Item = function (_React$Component) {
    _inherits(Item, _React$Component);

    function Item() {
        _classCallCheck(this, Item);

        return _possibleConstructorReturn(this, (Item.__proto__ || Object.getPrototypeOf(Item)).apply(this, arguments));
    }

    _createClass(Item, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                name = _props.name,
                icon = _props.icon,
                isThin = _props.isThin,
                column = _props.column,
                selected = _props.selected;

            // This acts as a Default value for the Prop

            var thinStyle = isThin === undefined ? '' : 'thin-item';
            var columnStyle = column === undefined ? '' : 'column-item';
            var selectedStyle = selected ? 'selected-item' : '';

            return React.createElement(
                'div',
                { className: 'shared-item-card clickable ' + thinStyle + ' ' + columnStyle + ' ' + selectedStyle, onClick: this.props.onClick },
                React.createElement(
                    'i',
                    { className: 'bi ' + icon },
                    ' '
                ),
                React.createElement(
                    'span',
                    null,
                    ' ',
                    name,
                    ' '
                )
            );
        }
    }]);

    return Item;
}(React.Component);