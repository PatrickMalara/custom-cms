var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GhostItem = function (_React$Component) {
    _inherits(GhostItem, _React$Component);

    function GhostItem(props) {
        _classCallCheck(this, GhostItem);

        var _this = _possibleConstructorReturn(this, (GhostItem.__proto__ || Object.getPrototypeOf(GhostItem)).call(this, props));

        _this.state = {
            is_editing: false,
            new_text: ""
        };

        _this.toggle_transform = function () {
            _this.setState({
                is_editing: !_this.state.is_editing
            });
        };

        _this.addition_clicked = function () {
            var new_text = _this.new_text.current.value.trim();
            _this.props.onCreate(new_text);

            _this.setState({
                is_editing: false
            });
        };

        _this.new_text = React.createRef();
        return _this;
    }

    _createClass(GhostItem, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                text = _props.text,
                isThin = _props.isThin;


            var thinStyle = isThin === undefined ? '' : 'thin-item';

            if (this.state.is_editing === false) {
                return React.createElement(
                    'div',
                    { className: 'shared-ghost-item-card clickable ' + thinStyle, onClick: this.toggle_transform },
                    React.createElement(
                        'i',
                        { className: '`bi bi-plus' },
                        ' '
                    ),
                    React.createElement(
                        'span',
                        null,
                        ' ',
                        text,
                        ' '
                    )
                );
            } else if (this.state.is_editing === true) {
                return React.createElement(
                    'div',
                    { className: 'shared-ghost-item-card clickable ' + thinStyle },
                    React.createElement('input', { id: 'new-page-text-input', ref: this.new_text, autoFocus: true, tabIndex: '0', className: 'form-control', placeholder: 'New...' }),
                    React.createElement('i', { onClick: this.addition_clicked, className: 'bi bi-plus clickable-icon float-right ml-05 ghost-button', tabIndex: '0' }),
                    React.createElement('i', { onClick: this.toggle_transform, className: 'bi bi-arrow-left-short clickable-icon float-right ghost-button' })
                );
            }
        }
    }]);

    return GhostItem;
}(React.Component);