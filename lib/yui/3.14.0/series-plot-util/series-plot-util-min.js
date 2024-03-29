YUI.add("series-plot-util",function(e,t){function s(e){var t={markers:{getter:function(){return this._markers}}};this.addAttrs(t,e)}var n=e.Lang,r=e.ClassNameManager.getClassName,i=r("seriesmarker");s.prototype={_plotDefaults:null,drawPlots:function(){if(!this.get("xcoords")||this.get("xcoords").length<1)return;var e=n.isNumber,t=this._copyObject(this.get("styles").marker),r=t.width,i=t.height,s=this.get("xcoords"),o=this.get("ycoords"),u=0,a=s.length,f=o[0],l,c,h=r/2,p=i/2,d,v,m=null,g=null,y=this.get("graphOrder"),b=this.get("groupMarkers");if(b){d=[],v=[];for(;u<a;++u)d.push(parseFloat(s[u]-h)),v.push(parseFloat(o[u]-p));this._createGroupMarker({xvalues:d,yvalues:v,fill:t.fill,border:t.border,dimensions:{width:r,height:i},graphOrder:y,shape:t.shape});return}n.isArray(t.fill.color)&&(m=t.fill.color.concat()),n.isArray(t.border.color)&&(g=t.border.color.concat()),this._createMarkerCache();for(;u<a;++u){f=parseFloat(o[u]-p),l=parseFloat(s[u]-h);if(!e(l)||!e(f)){this._markers.push(null);continue}m&&(t.fill.color=m[u%m.length]),g&&(t.border.color=g[u%g.length]),t.x=l,t.y=f,c=this.getMarker(t,y,u)}this._clearMarkerCache()},_groupShapes:{circle:e.CircleGroup,rect:e.RectGroup,ellipse:e.EllipseGroup,diamond:e.DiamondGroup},_getGroupShape:function(e){return n.isString(e)&&(e=this._groupShapes[e]),e},_getPlotDefaults:function(){var e={fill:{type:"solid",alpha:1,colors:null,alphas:null,ratios:null},border:{weight:1,alpha:1},width:10,height:10,shape:"circle"};return e.fill.color=this._getDefaultColor(this.get("graphOrder"),"fill"),e.border.color=this._getDefaultColor(this.get("graphOrder"),"border"),e},_markers:null,_markerCache:null,getMarker:function(e,t,n){var r,i=e.border;e.id=this._getChart().get("id")+"_"+t+"_"+n,i.opacity=i.alpha,e.stroke=i,e.fill.opacity=e.fill.alpha;if(this._markerCache.length>0){while(!r){if(this._markerCache.length<1){r=this._createMarker(e);break}r=this._markerCache.shift()}r.set(e)}else r=this._createMarker(e);return this._markers.push(r),r},_createMarker:function(e){var t=this.get("graphic"),n,r=this._copyObject(e);return r.type=r.shape,n=t.addShape(r),n.addClass(i),n},_createMarkerCache:function(){this._groupMarker&&(this._groupMarker.destroy(),this._groupMarker=null),this._markers&&this._markers.length>0?this._markerCache=this._markers.concat():this._markerCache=[],this._markers=[]},_createGroupMarker:function(e){var t,n=this.get("markers"),r=e.border,i,s,o;if(n&&n.length>0){while(n.length>0)t=n.shift(),t.destroy();this.set("markers",[])}r.opacity=r.alpha,s={id:this._getChart().get("id")+"_"+e.graphOrder,stroke:r,fill:e.fill,dimensions:e.dimensions,xvalues:e.xvalues,yvalues:e.yvalues},s.fill.opacity=e.fill.alpha,o=this._getGroupShape(e.shape),o&&(s.type=o),e.hasOwnProperty("radius")&&!isNaN(e.radius)&&(s.dimensions.radius=e.radius),this._groupMarker&&this._groupMarker.destroy(),i=this.get("graphic"),this._groupMarker=i.addShape(s),i._redraw()},_toggleVisible:function(e){var t,n=this.get("markers"),r=0,i;if(n){i=n.length;for(;r<i;++r)t=n[r],t&&t.set("visible",e)}},_clearMarkerCache:function(){var e;while(this._markerCache.length>0)e=this._markerCache.shift(),e&&e.destroy()},updateMarkerState:function(e,t){if(this._markers&&this._markers[t]){var n,r,i=this._copyObject(this.get("styles").marker),s=this._getState(e),o=this.get("xcoords"),u=this.get("ycoords"),a=this._markers[t],f=s==="off"||!i[s]?i:i[s];f.fill.color=this._getItemColor(f.fill.color,t),f.border.color=this._getItemColor(f.border.color,t),f.stroke=f.border,a.set(f),n=f.width,r=f.height,a.set("x",o[t]-n/2),a.set("y",u[t]-r/2),a.set("visible",this.get("visible"))}},_getItemColor:function(e,t){return n.isArray(e)?e[t%e.length]:e},_setStyles:function(t){return t=this._parseMarkerStyles(t),e.Renderer.prototype._setStyles.apply(this,[t])},_parseMarkerStyles:function(e){if(e.marker){var t=this._getPlotDefaults();e.marker=this._mergeStyles(e.marker,t),e.marker.over&&(e.marker.over=this._mergeStyles(e.marker.over,e.marker)),e.marker.down&&(e.marker.down=this._mergeStyles(e.marker.down,e.marker))}return e},_getState:function(e){var t;switch(e){case"mouseout":t="off";break;case"mouseover":t="over";break;case"mouseup":t="over";break;case"mousedown":t="down"}return t},_stateSyles:null,drawSeries:function(){this.drawPlots()},_getDefaultStyles:function(){var e=this._mergeStyles({marker:this._getPlotDefaults()},this.constructor.superclass._getDefaultStyles());return e}},e.augment(s,e.Attribute),e.Plots=s},"3.14.0");
