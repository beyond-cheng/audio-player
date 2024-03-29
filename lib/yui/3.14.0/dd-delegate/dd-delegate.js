YUI.add('dd-delegate', function (Y, NAME) {


    /**
     * Provides the ability to drag multiple nodes under a container element using only one Y.DD.Drag instance as a delegate.
     * @module dd
     * @submodule dd-delegate
     */
    /**
     * Provides the ability to drag multiple nodes under a container element using only one Y.DD.Drag instance as a delegate.
     * @class Delegate
     * @extends Base
     * @constructor
     * @namespace DD
     */


    var Delegate = function() {
        Delegate.superclass.constructor.apply(this, arguments);
    },
    CONT = 'container',
    NODES = 'nodes',
    _tmpNode = Y.Node.create('<div>Temp Node</div>');


    Y.extend(Delegate, Y.Base, {
        /**
        * The default bubbleTarget for this object. Default: Y.DD.DDM
        * @private
        * @property _bubbleTargets
        */
        _bubbleTargets: Y.DD.DDM,
        /**
        * A reference to the temporary dd instance used under the hood.
        * @property dd
        */
        dd: null,
        /**
        * The state of the Y.DD.DDM._noShim property to it can be reset.
        * @property _shimState
        * @private
        */
        _shimState: null,
        /**
        * Array of event handles to be destroyed
        * @private
        * @property _handles
        */
        _handles: null,
        /**
        * Listens to the nodeChange event and sets the dragNode on the temp dd instance.
        * @private
        * @method _onNodeChange
        * @param {Event} e The Event.
        */
        _onNodeChange: function(e) {
            this.set('dragNode', e.newVal);
        },
        /**
        * Listens for the drag:end event and updates the temp dd instance.
        * @private
        * @method _afterDragEnd
        * @param {Event} e The Event.
        */
        _afterDragEnd: function() {
            Y.DD.DDM._noShim = this._shimState;

            this.set('lastNode', this.dd.get('node'));
            this.get('lastNode').removeClass(Y.DD.DDM.CSS_PREFIX + '-dragging');
            this.dd._unprep();
            this.dd.set('node', _tmpNode);
        },
        /**
        * The callback for the Y.DD.Delegate instance used
        * @private
        * @method _delMouseDown
        * @param {Event} e The MouseDown Event.
        */
        _delMouseDown: function(e) {
            var tar = e.currentTarget,
                dd = this.dd,
                dNode = tar,
                config = this.get('dragConfig');

            if (tar.test(this.get(NODES)) && !tar.test(this.get('invalid'))) {
                this._shimState = Y.DD.DDM._noShim;
                Y.DD.DDM._noShim = true;
                this.set('currentNode', tar);
                dd.set('node', tar);
                if (config && config.dragNode) {
                    dNode = config.dragNode;
                } else if (dd.proxy) {
                    dNode = Y.DD.DDM._proxy;
                }
                dd.set('dragNode', dNode);
                dd._prep();

                dd.fire('drag:mouseDown', { ev: e });
            }
        },
        /**
        * Sets the target shim state
        * @private
        * @method _onMouseEnter
        * @param {Event} e The MouseEnter Event
        */
        _onMouseEnter: function() {
            this._shimState = Y.DD.DDM._noShim;
            Y.DD.DDM._noShim = true;
        },
        /**
        * Resets the target shim state
        * @private
        * @method _onMouseLeave
        * @param {Event} e The MouseLeave Event
        */
        _onMouseLeave: function() {
            Y.DD.DDM._noShim = this._shimState;
        },
        initializer: function() {
            this._handles = [];
            //Create a tmp DD instance under the hood.
            //var conf = Y.clone(this.get('dragConfig') || {}),
            var conf = this.get('dragConfig') || {},
                cont = this.get(CONT);

            conf.node = _tmpNode.cloneNode(true);
            conf.bubbleTargets = this;

            if (this.get('handles')) {
                conf.handles = this.get('handles');
            }

            this.dd = new Y.DD.Drag(conf);

            //On end drag, detach the listeners
            this.dd.after('drag:end', Y.bind(this._afterDragEnd, this));
            this.dd.on('dragNodeChange', Y.bind(this._onNodeChange, this));
            this.dd.after('drag:mouseup', function() {
                this._unprep();
            });

            //Attach the delegate to the container
            this._handles.push(Y.delegate(Y.DD.Drag.START_EVENT, Y.bind(this._delMouseDown, this), cont, this.get(NODES)));

            this._handles.push(Y.on('mouseenter', Y.bind(this._onMouseEnter, this), cont));

            this._handles.push(Y.on('mouseleave', Y.bind(this._onMouseLeave, this), cont));

            Y.later(50, this, this.syncTargets);
            Y.DD.DDM.regDelegate(this);
        },
        /**
        * Applies the Y.Plugin.Drop to all nodes matching the cont + nodes selector query.
        * @method syncTargets
        * @return {Self}
        * @chainable
        */
        syncTargets: function() {
            if (!Y.Plugin.Drop || this.get('destroyed')) {
                return;
            }
            var items, groups, config;

            if (this.get('target')) {
                items = Y.one(this.get(CONT)).all(this.get(NODES));
                groups = this.dd.get('groups');
                config = this.get('dragConfig');

                if (config && config.groups) {
                    groups = config.groups;
                }

                items.each(function(i) {
                    this.createDrop(i, groups);
                }, this);
            }
            return this;
        },
        /**
        * Apply the Drop plugin to this node
        * @method createDrop
        * @param {Node} node The Node to apply the plugin to
        * @param {Array} groups The default groups to assign this target to.
        * @return Node
        */
        createDrop: function(node, groups) {
            var config = {
                useShim: false,
                bubbleTargets: this
            };

            if (!node.drop) {
                node.plug(Y.Plugin.Drop, config);
            }
            node.drop.set('groups', groups);
            return node;
        },
        destructor: function() {
            if (this.dd) {
                this.dd.destroy();
            }
            if (Y.Plugin.Drop) {
                var targets = Y.one(this.get(CONT)).all(this.get(NODES));
                targets.unplug(Y.Plugin.Drop);
            }
            Y.Array.each(this._handles, function(v) {
                v.detach();
            });
        }
    }, {
        NAME: 'delegate',
        ATTRS: {
            /**
            * A selector query to get the container to listen for mousedown events on. All "nodes" should be a child of this container.
            * @attribute container
            * @type String
            */
            container: {
                value: 'body'
            },
            /**
            * A selector query to get the children of the "container" to make draggable elements from.
            * @attribute nodes
            * @type String
            */
            nodes: {
                value: '.dd-draggable'
            },
            /**
            * A selector query to test a node to see if it's an invalid item.
            * @attribute invalid
            * @type String
            */
            invalid: {
                value: 'input, select, button, a, textarea'
            },
            /**
            * Y.Node instance of the last item dragged.
            * @attribute lastNode
            * @type Node
            */
            lastNode: {
                value: _tmpNode
            },
            /**
            * Y.Node instance of the dd node.
            * @attribute currentNode
            * @type Node
            */
            currentNode: {
                value: _tmpNode
            },
            /**
            * Y.Node instance of the dd dragNode.
            * @attribute dragNode
            * @type Node
            */
            dragNode: {
                value: _tmpNode
            },
            /**
            * Is the mouse currently over the container
            * @attribute over
            * @type Boolean
            */
            over: {
                value: false
            },
            /**
            * Should the items also be a drop target.
            * @attribute target
            * @type Boolean
            */
            target: {
                value: false
            },
            /**
            * The default config to be used when creating the DD instance.
            * @attribute dragConfig
            * @type Object
            */
            dragConfig: {
                value: null
            },
            /**
            * The handles config option added to the temp DD instance.
            * @attribute handles
            * @type Array
            */
            handles: {
                value: null
            }
        }
    });

    Y.mix(Y.DD.DDM, {
        /**
        * Holder for all Y.DD.Delegate instances
        * @private
        * @for DDM
        * @property _delegates
        * @type Array
        */
        _delegates: [],
        /**
        * Register a Delegate with the DDM
        * @for DDM
        * @method regDelegate
        */
        regDelegate: function(del) {
            this._delegates.push(del);
        },
        /**
        * Get a delegate instance from a container node
        * @for DDM
        * @method getDelegate
        * @return Y.DD.Delegate
        */
        getDelegate: function(node) {
            var del = null;
            node = Y.one(node);
            Y.Array.each(this._delegates, function(v) {
                if (node.test(v.get(CONT))) {
                    del = v;
                }
            }, this);
            return del;
        }
    });

    Y.namespace('DD');
    Y.DD.Delegate = Delegate;




}, '3.14.0', {"requires": ["dd-drag", "dd-drop-plugin", "event-mouseenter"]});
