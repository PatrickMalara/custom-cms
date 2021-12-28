var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Item = function (_React$Component) {
    _inherits(Item, _React$Component);

    function Item(props) {
        _classCallCheck(this, Item);

        var _this = _possibleConstructorReturn(this, (Item.__proto__ || Object.getPrototypeOf(Item)).call(this, props));

        _this.state = {
            is_hover: false,
            is_editing: false,
            new_text: ""
        };

        _this.toggle_editing = function () {
            _this.setState({
                is_editing: !_this.state.is_editing,
                is_hover: false
            }, function () {

                if (_this.state.is_editing === true) {
                    console.log(_this.props.name);
                    _this.new_name.current.value = _this.props.name;
                }
            });
        };

        _this.onUpdated = function () {
            _this.props.onUpdated(_this.new_name.current.value.trim());

            _this.setState({
                is_editing: false,
                is_hover: false
            });
        };

        _this.toggleHover = function () {
            _this.setState({
                is_hover: !_this.state.is_hover
            });
        };

        _this.new_name = React.createRef();
        return _this;
    }

    /*
     * I know I can do this with just CSS
     * however, I think Its best to keep an internal
     * state in case I want to make this components
     * customizable in the future...
     */


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

            // Conditional Rendering
            var hover = "";
            if (this.state.is_hover === true) {
                hover = React.createElement(
                    React.Fragment,
                    null,
                    React.createElement(
                        'i',
                        { onClick: this.props.onDelete, className: 'bi bi-trash float-right item-card-icon ml-05' },
                        ' '
                    ),
                    React.createElement(
                        'i',
                        { onClick: this.toggle_editing, className: 'bi bi-pencil float-right item-card-icon' },
                        ' '
                    )
                );
            }

            if (this.state.is_editing === false) {
                return React.createElement(
                    'div',
                    { className: 'shared-item-card clickable ' + thinStyle + ' ' + columnStyle + ' ' + selectedStyle,
                        onMouseEnter: this.toggleHover,
                        onMouseLeave: this.toggleHover,
                        onClick: this.props.onClick },
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
                    ),
                    hover
                );
            } else {
                return React.createElement(
                    'div',
                    { className: 'shared-item-card clickable ' + thinStyle + ' ' + columnStyle + ' ' + selectedStyle,
                        onMouseLeave: this.toggle_editing },
                    React.createElement('input', { ref: this.new_name, autoFocus: true, tabIndex: '0', className: 'form-control', placeholder: 'New...' }),
                    React.createElement('i', { onClick: this.onUpdated, className: 'bi bi-check clickable-icon float-right ml-05 ghost-button', tabIndex: '0' }),
                    React.createElement('i', { onClick: this.toggle_editing, className: 'bi bi-arrow-left-short clickable-icon float-right ghost-button' })
                );
            }
        }
    }]);

    return Item;
}(React.Component);