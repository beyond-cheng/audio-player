YUI.add('dd-ddm-drop', function (Y, NAME) {


    /**
     * Extends the dd-ddm Class to add support for the placement of Drop Target
     * shims inside the viewport shim. It also handles all Drop Target related events and interactions.
     * @module dd
     * @submodule dd-ddm-drop
     * @for DDM
     * @namespace DD
     */

    //TODO CSS class name for the bestMatch..
    Y.mix(Y.DD.DDM, {
        /**
        * This flag turns off the use of the mouseover/mouseout shim. It should not be used unless you know what you are doing.
        * @private
        * @property _noShim
        * @type {Boolean}
        */
        _noShim: false,
        /**
        * Placeholder for all active shims on the page
        * @private
        * @property _activeShims
        * @type {Array}
        */
        _activeShims: [],
        /**
        * This method checks the _activeShims Object to see if there is a shim active.
        * @private
        * @method _hasActiveShim
        * @return {Boolean}
        */
        _hasActiveShim: function() {
            if (this._noShim) {
                return true;
            }
            return this._activeShims.length;
        },
        /**
        * Adds a Drop Target to the list of active shims
        * @private
        * @method _addActiveShim
        * @param {Object} d The Drop instance to add to the list.
        */
        _addActiveShim: function(d) {
            this._activeShims.push(d);
        },
        /**
        * Removes a Drop Target to the list of active shims
        * @private
        * @method _removeActiveShim
        * @param {Object} d The Drop instance to remove from the list.
        */
        _removeActiveShim: function(d) {
            var s = [];
            Y.Array.each(this._activeShims, function(v) {
                if (v._yuid !== d._yuid) {
                    s.push(v);
                }

            });
            this._activeShims = s;
        },
        /**
        * This method will sync the position of the shims on the Drop Targets that are currently active.
        * @method syncActiveShims
        * @param {Boolean} force Resize/sync all Targets.
        */
        syncActiveShims: function(force) {
            Y.later(0, this, function(force) {
                var drops = ((force) ? this.targets : this._lookup());
                Y.Array.each(drops, function(v) {
                    v.sizeShim.call(v);
                }, this);
            }, force);
        },
        /**
        * The mode that the drag operations will run in 0 for Point, 1 for Intersect, 2 for Strict
        * @private
        * @property mode
        * @type Number
        */
        mode: 0,
        /**
        * In point mode, a Drop is targeted by the cursor being over the Target
        * @private
        * @property POINT
        * @type Number
        */
        POINT: 0,
        /**
        * In intersect mode, a Drop is targeted by "part" of the drag node being over the Target
        * @private
        * @property INTERSECT
        * @type Number
        */
        INTERSECT: 1,
        /**
        * In strict mode, a Drop is targeted by the "entire" drag node being over the Target
        * @private
        * @property STRICT
        * @type Number
        */
        STRICT: 2,
        /**
        * Should we only check targets that are in the viewport on drags (for performance), default: true
        * @property useHash
        * @type {Boolean}
        */
        useHash: true,
        /**
        * A reference to the active Drop Target
        * @property activeDrop
        * @type {Object}
        */
        activeDrop: null,
        /**
        * An array of the valid Drop Targets for this interaction.
        * @property validDrops
        * @type {Array}
        */
        //TODO Change array/object literals to be in sync..
        validDrops: [],
        /**
        * An object literal of Other Drop Targets that we encountered during this interaction (in the case of overlapping Drop Targets)
        * @property otherDrops
        * @type {Object}
        */
        otherDrops: {},
        /**
        * All of the Targets
        * @property targets
        * @type {Array}
        */
        targets: [],
        /**
        * Add a Drop Target to the list of Valid Targets. This list get's regenerated on each new drag operation.
        * @private
        * @method _addValid
        * @param {Object} drop
        * @return {Self}
        * @chainable
        */
        _addValid: function(drop) {
            this.validDrops.push(drop);
            return this;
        },
        /**
        * Removes a Drop Target from the list of Valid Targets. This list get's regenerated on each new drag operation.
        * @private
        * @method _removeValid
        * @param {Object} drop
        * @return {Self}
        * @chainable
        */
        _removeValid: function(drop) {
            var drops = [];
            Y.Array.each(this.validDrops, function(v) {
                if (v !== drop) {
                    drops.push(v);
                }
            });

            this.validDrops = drops;
            return this;
        },
        /**
        * Check to see if the Drag element is over the target, method varies on current mode
        * @method isOverTarget
        * @param {Object} drop The drop to check against
        * @return {Boolean}
        */
        isOverTarget: function(drop) {
            if (this.activeDrag && drop) {
                var xy = this.activeDrag.mouseXY, r, dMode = this.activeDrag.get('dragMode'),
                    aRegion, node = drop.shim;
                if (xy && this.activeDrag) {
                    aRegion = this.activeDrag.region;
                    if (dMode === this.STRICT) {
                        return this.activeDrag.get('dragNode').inRegion(drop.region, true, aRegion);
                    }
                    if (drop && drop.shim) {
                        if ((dMode === this.INTERSECT) && this._noShim) {
                            r = aRegion || this.activeDrag.get('node');
                            return drop.get('node').intersect(r, drop.region).inRegion;
                        }

                        if (this._noShim) {
                            node = drop.get('node');
                        }
                        return node.intersect({
                            top: xy[1],
                            bottom: xy[1],
                            left: xy[0],
                            right: xy[0]
                        }, drop.region).inRegion;
                    }
                }
            }
            return false;
        },
        /**
        * Clears the cache data used for this interaction.
        * @method clearCache
        */
        clearCache: function() {
            this.validDrops = [];
            this.otherDrops = {};
            this._activeShims = [];
        },
        /**
        * Clear the cache and activate the shims of all the targets
        * @private
        * @method _activateTargets
        */
        _activateTargets: function() {
            this._noShim = true;
            this.clearCache();
            Y.Array.each(this.targets, function(v) {
                v._activateShim([]);
                if (v.get('noShim') === true) {
                    this._noShim = false;
                }
            }, this);
            this._handleTargetOver();

        },
        /**
        * This method will gather the area for all potential targets and see which has the hightest covered area and return it.
        * @method getBestMatch
        * @param {Array} drops An Array of drops to scan for the best match.
        * @param {Boolean} all If present, it returns an Array. First item is best match, second is an Array of the other items in the original Array.
        * @return {Object or Array}
        */
        getBestMatch: function(drops, all) {
            var biggest = null, area = 0, out;

            Y.Array.each(drops, function(v) {
                var inter = this.activeDrag.get('dragNode').intersect(v.get('node'));
                v.region.area = inter.area;

                if (inter.inRegion) {
                    if (inter.area > area) {
                        area = inter.area;
                        biggest = v;
                    }
                }
            }, this);
            if (all) {
                out = [];
                //TODO Sort the others in numeric order by area covered..
                Y.Array.each(drops, function(v) {
                    if (v !== biggest) {
                        out.push(v);
                    }
                }, this);
                return [biggest, out];
            }
            return biggest;
        },
        /**
        * This method fires the drop:hit, drag:drophit, drag:dropmiss methods and deactivates the shims..
        * @private
        * @method _deactivateTargets
        */
        _deactivateTargets: function() {
            var other = [], tmp,
                activeDrag = this.activeDrag,
                activeDrop = this.activeDrop;

            //TODO why is this check so hard??
            if (activeDrag && activeDrop && this.otherDrops[activeDrop]) {
                if (!activeDrag.get('dragMode')) {
                    //TODO otherDrops -- private..
                    other = this.otherDrops;
                    delete other[activeDrop];
                } else {
                    tmp = this.getBestMatch(this.otherDrops, true);
                    activeDrop = tmp[0];
                    other = tmp[1];
                }
                activeDrag.get('node').removeClass(this.CSS_PREFIX + '-drag-over');
                if (activeDrop) {
                    activeDrop.fire('drop:hit', { drag: activeDrag, drop: activeDrop, others: other });
                    activeDrag.fire('drag:drophit', { drag: activeDrag,  drop: activeDrop, others: other });
                }
            } else if (activeDrag && activeDrag.get('dragging')) {
                activeDrag.get('node').removeClass(this.CSS_PREFIX + '-drag-over');
                activeDrag.fire('drag:dropmiss', { pageX: activeDrag.lastXY[0], pageY: activeDrag.lastXY[1] });
            }

            this.activeDrop = null;

            Y.Array.each(this.targets, function(v) {
                v._deactivateShim([]);
            }, this);
        },
        /**
        * This method is called when the move method is called on the Drag Object.
        * @private
        * @method _dropMove
        */
        _dropMove: function() {
            if (this._hasActiveShim()) {
                this._handleTargetOver();
            } else {
                Y.Array.each(this.otherDrops, function(v) {
                    v._handleOut.apply(v, []);
                });
            }
        },
        /**
        * Filters the list of Drops down to those in the viewport.
        * @private
        * @method _lookup
        * @return {Array} The valid Drop Targets that are in the viewport.
        */
        _lookup: function() {
            if (!this.useHash || this._noShim) {
                return this.validDrops;
            }
            var drops = [];
            //Only scan drop shims that are in the Viewport
            Y.Array.each(this.validDrops, function(v) {
                if (v.shim && v.shim.inViewportRegion(false, v.region)) {
                    drops.push(v);
                }
            });
            return drops;

        },
        /**
        * This method execs _handleTargetOver on all valid Drop Targets
        * @private
        * @method _handleTargetOver
        */
        _handleTargetOver: function() {
            var drops = this._lookup();
            Y.Array.each(drops, function(v) {
                v._handleTargetOver.call(v);
            }, this);
        },
        /**
        * Add the passed in Target to the targets collection
        * @private
        * @method _regTarget
        * @param {Object} t The Target to add to the targets collection
        */
        _regTarget: function(t) {
            this.targets.push(t);
        },
        /**
        * Remove the passed in Target from the targets collection
        * @private
        * @method _unregTarget
        * @param {Object} drop The Target to remove from the targets collection
        */
        _unregTarget: function(drop) {
            var targets = [], vdrops;
            Y.Array.each(this.targets, function(v) {
                if (v !== drop) {
                    targets.push(v);
                }
            }, this);
            this.targets = targets;

            vdrops = [];
            Y.Array.each(this.validDrops, function(v) {
                if (v !== drop) {
                    vdrops.push(v);
                }
            });

            this.validDrops = vdrops;
        },
        /**
        * Get a valid Drop instance back from a Node or a selector string, false otherwise
        * @method getDrop
        * @param {String/Object} node The Node instance or Selector string to check for a valid Drop Object
        * @return {Object}
        */
        getDrop: function(node) {
            var drop = false,
                n = Y.one(node);
            if (n instanceof Y.Node) {
                Y.Array.each(this.targets, function(v) {
                    if (n.compareTo(v.get('node'))) {
                        drop = v;
                    }
                });
            }
            return drop;
        }
    }, true);




}, '3.14.0', {"requires": ["dd-ddm"]});
