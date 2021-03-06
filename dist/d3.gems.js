/*! d3-gems v0.0.7 02-02-2014 */
!function(window) {
    !function(ns) {
        ns.area_chart = function() {
            function renderer(ctx) {
                function translate_x(d, i) {
                    return x(ctx.axes.x.scalar || ctx.axes.x.is_time ? ctx.categories[i] : i);
                }
                var x = ctx.scales.x, y = ctx.scales.y, area = d3.svg.area().x(translate_x).y0(ctx.height).y1(function(d) {
                    return y(d);
                }), g = ctx.canvas.selectAll("g.area").data(ctx.data).enter().append("g").classed("area", !0).attr("data-series", function(d, i) {
                    return i;
                }).each(ctx.tip).each(ns.hightlight);
                g.append("path").style("stroke", "none").style("fill", function(d, i) {
                    return ctx.color(i);
                }).attr("d", area);
            }
            return renderer.init = function(ctx) {
                var line = ns.line_chart();
                return line.init(ctx);
            }, renderer;
        };
    }("undefined" == typeof f3 ? window.f3 = {} : f3), function(ns) {
        ns.bar_chart = function() {
            function renderer(ctx) {
                function translate_x(d, i) {
                    return ctx.axes.x.scalar ? x(ctx.categories[i]) - group_width / 2 : x(i);
                }
                {
                    var x = ctx.scales.x, y = ctx.scales.y, group_width = calc_group_width(ctx), x1 = d3.scale.ordinal().domain(d3.range(0, ctx.series.length)).rangeRoundBands([ 0, group_width ]), min = ctx.min, data = ctx.data, height = ctx.height, y0 = y(0 > min ? 0 : min), h0 = height - y0, group = ctx.canvas.selectAll("g.colgroup").data(data).enter().append("g").attr("class", "colgroup").attr("transform", function(d, i) {
                        return "translate(" + translate_x(d, i) + ",0)";
                    });
                    d3.map();
                }
                group.selectAll("rect.bar").data(function(d) {
                    return d;
                }).enter().append("rect").attr("data-series", function(d, i) {
                    return i;
                }).classed("bar", !0).attr("x", function(d, i) {
                    return x1(i);
                }).attr("y", function(d) {
                    return d.y < 0 ? y0 : y(d.y);
                }).attr("width", x1.rangeBand()).attr("height", function(d) {
                    return d.y < 0 ? y(d.y) - y0 : height - h0 - y(d.y);
                }).style("stroke", "none").style("fill", function(d, i) {
                    return ctx.color(i);
                }).each(ctx.tip).each(ns.hightlight);
            }
            function calc_group_width(ctx) {
                var x = ctx.scales.x, xaxis = ctx.axes.x;
                if (xaxis.scalar) {
                    var axis = xaxis.create(x), ticks = ns.scale.ticks(x, axis), tickCount = xaxis.is_time ? ticks.length + 1 : ticks.length;
                    return ns.scale.ordinal(ctx.width, tickCount).rangeBand();
                }
                return x.rangeBand();
            }
            return renderer.init = function(ctx) {
                for (var def = ctx.def, min = 0/0, max = 0/0, data = [], i = 0; i < ctx.categories.length; i++) {
                    for (var group = [], j = 0; j < ctx.series.length; j++) {
                        var key = ctx.series[j], val = def.series[key][i];
                        group.push({
                            x: i,
                            y: val
                        }), isNaN(min) ? (min = val, max = val) : (min = Math.min(min, val), max = Math.max(max, val));
                    }
                    data.push(group);
                }
                return min > 0 && (min -= max == min ? .2 * max : .2 * (max - min)), {
                    data: data,
                    min: min,
                    max: max
                };
            }, renderer;
        };
    }("undefined" == typeof f3 ? window.f3 = {} : f3), function(ns) {
        "undefined" == typeof ns.chart && (ns.chart = {}), ns.chart.render_body = function(ctx) {
            var layout = ctx.layout, is_bottom_legend = 0 === ctx.legend.position.indexOf("bottom");
            d3.select(ctx.container).selectAll("svg").remove();
            var selection = d3.select(ctx.container).selectAll("svg").data([ ctx ]).enter(), svg = is_bottom_legend ? selection.insert("svg", ".legend") : selection.append("svg");
            svg.style("display", "block").attr("width", layout.width).attr("height", layout.height), 
            ctx.svg = svg, ctx.tip = ns.chart.tip(ctx);
            var plot = ns.chart.plot().init(ctx);
            return svg.append("g").attr("transform", "translate(" + layout.margin.left + "," + layout.margin.top + ")").call(plot), 
            svg[0];
        };
    }("undefined" == typeof f3 ? window.f3 = {} : f3), function(ns) {
        d3.chart = function() {
            function chart(selection) {
                selection.each(function(def) {
                    def.axes || (def.axes = {}), def.axes.x || (def.axes.x = {}), def.axes.y || (def.axes.y = {});
                    var series_keys = Object.keys(Array.isArray(def.series) ? def.series[0] : def.series), color = Array.isArray(def.palette) ? d3.scale.ordinal().range(def.palette) : default_palette(series_keys), ctx = {
                        def: def,
                        container: this,
                        categories: "function" == typeof def.categories ? def.categories() : def.categories,
                        series: series_keys,
                        color: color
                    };
                    ctx.renderer = ns.chart.renderer(def), ctx = $.extend(ctx, ctx.renderer.init(ctx)), 
                    ns.axes.init(ctx), ctx.layout = {
                        width: width,
                        height: height,
                        margin: {
                            left: 5,
                            top: 5,
                            right: 5,
                            bottom: 5
                        }
                    }, ns.axes.measure(ctx);
                    var title = ns.chart.title(ctx), legend = ns.chart.legend(ctx);
                    return ctx.legend = legend, ctx.layout.height -= title.height + legend.height, ns.chart.render_body(ctx), 
                    this;
                });
            }
            function default_palette(keys) {
                var color = keys.length <= 10 ? d3.scale.category10() : d3.scale.category20();
                return color.domain(0, keys.length - 1), color;
            }
            var width = 300, height = 200;
            return chart.width = function(value) {
                return arguments.length ? (width = value, chart) : width;
            }, chart.height = function(value) {
                return arguments.length ? (height = value, chart) : height;
            }, chart;
        };
    }("undefined" == typeof f3 ? window.f3 = {} : f3), function(ns) {
        var dateClass = "[object Date]";
        ns.isDate = function(value) {
            return value && "object" == typeof value && toString.call(value) == dateClass;
        }, ns.title_attr = function(value, axis) {
            var format = axis ? axis.format || "g" : "g";
            return ns.format(value, format);
        }, ns.format = function(value, format) {
            if (void 0 === value) return "";
            if ("function" == typeof format) return format(value);
            if ("number" == typeof value) {
                var fn = d3.format(format);
                return fn(value);
            }
            if (ns.isDate(value)) {
                var f = d3.time.format(format || "%y-%m-%d");
                return f(value);
            }
            return String(value);
        }, ns.sformat = function() {
            var args = arguments;
            return args[0].replace(/{(\d+)}/g, function(m, i) {
                var index = +i + 1;
                return index < args.length ? args[index] : "";
            });
        };
    }("undefined" == typeof f3 ? window.f3 = {} : f3), function(ns) {
        ns.cumulative_flow_diagram = function() {
            function renderer(ctx) {
                return area_chart(ctx);
            }
            var area_chart = ns.area_chart();
            return renderer.init = function(ctx) {
                var def = ctx.def, count = 0;
                if (Array.isArray(def.series)) {
                    count = def.series.length;
                    var hash = {}, keys = null;
                    def.series.forEach(function(it) {
                        keys || (keys = Object.keys(it)), keys.forEach(function(key) {
                            var val = it[key], arr = hash[key] || (hash[key] = []);
                            arr.push(val);
                        });
                    }), def.series = hash;
                } else count = def.series[Object.keys(def.series)[0]].length;
                return ctx.categories || (ctx.categories = d3.range(1, count + 1), ctx.period = {
                    step: "day"
                }), area_chart.init(ctx);
            }, renderer;
        };
    }("undefined" == typeof f3 ? window.f3 = {} : f3), function(ns) {
        ns.hightlight = function() {
            d3.select(this).style("opacity", .75).on("mouseover.highlight", function() {
                d3.select(this).transition().duration(100).style("opacity", .95);
            }).on("mouseout.highlight", function() {
                d3.select(this).transition().duration(100).style("opacity", .75);
            });
        };
    }("undefined" == typeof f3 ? window.f3 = {} : f3), function(ns) {
        function create_xscale(ctx, xaxis) {
            return xaxis.scalar || xaxis.is_time ? ns.scale.scalar(ctx) : ctx.is_ordinal ? function(width) {
                return d3.scale.ordinal().rangePoints([ 0, width ]).domain(d3.range(0, ctx.categories.length));
            } : function(width) {
                return ns.scale.ordinal(width, ctx.categories.length);
            };
        }
        function create_yscale(ctx) {
            var config = ctx.def.axes.y;
            return config && ($.isNumeric(config.min) && (ctx.min = config.min), $.isNumeric(config.max) && (ctx.max = config.max)), 
            function(height) {
                return d3.scale.linear().range([ height, 0 ]).domain([ ctx.min, ctx.max ]);
            };
        }
        function create_xaxis(ctx, scale) {
            var axis = d3.svg.axis().scale(scale || ctx.scales.x).orient("bottom").tickSize(3), config = ctx.axes.x;
            return null !== config.ticks && ($.isNumeric(config.ticks) ? axis.ticks(config.ticks) : $.isArray(config.ticks) && axis.ticks.apply(axis, config.ticks)), 
            axis;
        }
        function create_yaxis(ctx, scale) {
            return d3.svg.axis().scale(scale || ctx.scales.y).orient("left").tickSize(3);
        }
        "undefined" == typeof ns.axes && (ns.axes = {}), ns.axes.init = function(ctx) {
            var def = ctx.def, xaxis = {
                ticks: null,
                scalar: def.axes && def.axes.x && !!def.axes.x.scalar,
                is_time: ctx.categories.filter(ns.isDate).length > 0,
                create: create_xaxis
            }, yaxis = {
                scale: create_yscale(ctx),
                create: create_yaxis
            };
            ctx.axes = {
                x: xaxis,
                y: yaxis
            }, xaxis.scale = create_xscale(ctx, xaxis);
        };
    }("undefined" == typeof f3 ? window.f3 = {} : f3), function() {
        $.fn.chart = function(chartProvider) {
            return void 0 === chartProvider && (chartProvider = function(e) {
                var data = $(e).data("chart");
                return "string" == typeof data ? window.__charts__[data] : "object" == typeof data ? data : {
                    data: []
                };
            }), this.each(function() {
                var $this = $(this), width = $this.width(), height = $this.height(), chart = d3.chart().width(width).height(height), def = "function" == typeof chartProvider ? chartProvider(this) : chartProvider;
                d3.select(this).data([ def ]).call(chart);
            });
        };
    }(), function(ns) {
        function item_renderer(ctx) {
            return function() {
                var elem = d3.select(this).classed("item", !0), nbsp = String.fromCharCode(160);
                return elem.append("span").style("background-color", function(i) {
                    return ctx.color(i);
                }).text(nbsp + nbsp), elem.append("span").text(nbsp), elem.append("span").text(function(i) {
                    return ctx.series[i];
                }), elem;
            };
        }
        "undefined" == typeof ns.chart && (ns.chart = {}), ns.chart.legend = function(ctx) {
            d3.select(ctx.container).selectAll("div.legend").remove();
            var def = ctx.def.legend || {}, position = (def.position || "topright").toLowerCase(), div = d3.select(ctx.container).append("div").classed("legend", !0).attr("data-position", position).style("margin-left", ctx.layout.margin.left).style("margin-right", ctx.layout.margin.right), item = item_renderer(ctx), range = d3.range(0, ctx.series.length);
            div.selectAll("div.item").data(range).enter().append("div").each(item);
            var $e = $(div[0]);
            return {
                element: $e[0],
                height: $e.outerHeight(),
                position: position
            };
        };
    }("undefined" == typeof f3 ? window.f3 = {} : f3), function(ns) {
        ns.line_chart = function() {
            function renderer(ctx) {
                function translate_x(d, i) {
                    return x(ctx.axes.x.scalar ? ctx.categories[i] : i);
                }
                var x = ctx.scales.x, y = ctx.scales.y, line = d3.svg.line().x(translate_x).y(y), g = ctx.canvas.selectAll("g.line").data(ctx.data).enter().append("g").classed("line", !0).attr("data-series", function(d, i) {
                    return i;
                });
                g.append("path").style("stroke", function(d, i) {
                    return ctx.color(i);
                }).style("fill", "none").attr("d", function(d) {
                    return line(d);
                }), ns.chart.points(ctx, g);
            }
            function get_series(ctx, i) {
                return ctx.def.series[ctx.series[i]].map(function(pt) {
                    return pt;
                });
            }
            return renderer.init = function(ctx) {
                for (var min = (ctx.def, 0/0), max = 0/0, data = [], i = 0; i < ctx.series.length; i++) {
                    var series = get_series(ctx, i), e = d3.extent(series);
                    isNaN(min) ? (min = e[0], max = e[1]) : (min = Math.min(min, e[0]), max = Math.max(max, e[1])), 
                    data.push(series);
                }
                return {
                    is_ordinal: !0,
                    min: min,
                    max: max,
                    data: data
                };
            }, renderer;
        };
    }("undefined" == typeof f3 ? window.f3 = {} : f3), function(ns) {
        ns.axes.measure = function(ctx) {
            var layout = ctx.layout, svg = d3.select(ctx.container).append("svg").style("display", "block").attr("width", layout.width).attr("height", layout.height);
            ns.chart.plot().init(ctx), ctx.canvas = svg.append("g");
            var axes = ns.axes.render(ctx), label = axes.views.x.select("text").node();
            layout.margin.top += d3.round(label.getBBox().height / 2), layout.margin.left += axes.width, 
            layout.margin.bottom += axes.height, svg.remove();
        };
    }("undefined" == typeof f3 ? window.f3 = {} : f3), function(ns) {
        "undefined" == typeof ns.chart && (ns.chart = {}), ns.chart.plot = function() {
            function plot(element) {
                element.each(function(ctx) {
                    ctx.canvas = d3.select(this), ns.chart.plotarea(ctx), ctx.renderer(ctx), ns.axes.render(ctx);
                });
            }
            return plot.init = function(ctx) {
                var layout = ctx.layout, width = layout.width - layout.margin.left - layout.margin.right, height = layout.height - layout.margin.top - layout.margin.bottom;
                return ctx.width = width, ctx.height = height, ctx.scales = {
                    x: ctx.axes.x.scale(width),
                    y: ctx.axes.y.scale(height)
                }, plot;
            }, plot;
        };
    }("undefined" == typeof f3 ? window.f3 = {} : f3), function(ns) {
        "undefined" == typeof ns.chart && (ns.chart = {}), ns.chart.plotarea = function(ctx) {
            return ctx.canvas.append("rect").attr("class", "plotarea").attr("x", 0).attr("y", 0).attr("width", ctx.width).attr("height", ctx.height);
        };
    }("undefined" == typeof f3 ? window.f3 = {} : f3), function(ns) {
        "undefined" == typeof ns.chart && (ns.chart = {}), ns.chart.points = function(ctx, g) {
            function translate_x(d, i) {
                return x(ctx.axes.x.scalar ? ctx.categories[i] : i);
            }
            var x = ctx.scales.x, y = ctx.scales.y;
            g.selectAll("circle.point").data(function(d, i) {
                return d.map(function(val) {
                    return {
                        x: i,
                        y: val
                    };
                });
            }).enter().append("circle").classed("point", !0).attr("cx", function(d, i) {
                return translate_x(d, i);
            }).attr("cy", function(d) {
                return y(d.y);
            }).attr("r", 4).style("stroke", "white").style("stroke-width", "2").style("fill", function(d) {
                return ctx.color(d.x);
            }).each(ctx.tip).on("mouseover.pt", function() {
                d3.select(this).style("stroke", function(d) {
                    return ctx.color(d.x);
                }).style("fill", "white");
            }).on("mouseout.pt", function() {
                d3.select(this).style("stroke", "white").style("fill", function(d) {
                    return ctx.color(d.x);
                });
            });
        };
    }("undefined" == typeof f3 ? window.f3 = {} : f3), function(ns) {
        function axis_config(config) {
            return $.extend({}, config, {
                title: function() {
                    return config.title && config.title.text ? config.title.text : "";
                },
                format: function() {
                    return config.format ? function(v) {
                        return ns.format(v, config.format);
                    } : null;
                }
            });
        }
        function arrange_category_axis(ctx, axis, view) {
            var scale = ctx.scales.x, categories = ctx.categories, labels = view.selectAll("text");
            if (!(0 === labels.length || categories.length < 2)) {
                var step, bounds = labels[0].map(function(e) {
                    return e.getBBox();
                }), maxWidth = d3.max(bounds, function(r) {
                    return r.width;
                });
                if (ctx.axes.x.scalar) {
                    var ticks = ns.scale.ticks(scale, axis);
                    step = Math.abs(scale(ticks[1]) - scale(ticks[0]));
                } else step = Math.abs(scale(1) - scale(0));
                if (!(step >= maxWidth)) {
                    var ellipsis = view.append("text").text("..."), ellipsisWidth = ellipsis.node().getBBox().width;
                    ellipsis.remove(), maxWidth = 2 * step - 6 - ellipsisWidth;
                    var labelHeight = d3.max(bounds, function(r) {
                        return r.height;
                    });
                    labels.each(function(d, i) {
                        var label = d3.select(this), h = 1 & i ? labelHeight : 0;
                        label.attr("transform", "translate(0, " + h + ")"), trim_label(this, maxWidth);
                    });
                }
            }
        }
        function trim_label(label, maxWidth) {
            for (var wrapper = d3.select(label), text = wrapper.text(), n = 1; n < text.length && label.getSubStringLength(0, n) <= maxWidth; ) n++;
            n < text.length && wrapper.text(text.substr(0, n - 1) + "...");
        }
        "undefined" == typeof ns.axes && (ns.axes = {}), ns.axes.render = function(ctx) {
            var def = ctx.def, bottom = ctx.height, xconfig = axis_config(def.axes.x), yconfig = axis_config(def.axes.y), xaxis = ctx.axes.x.create(ctx), yaxis = ctx.axes.y.create(ctx);
            xaxis.tickFormat(function(d, i) {
                var f = xconfig.format() || String, v = xconfig.scalar ? d : ctx.categories[i];
                return f(v);
            });
            var format = yconfig.format();
            format && yaxis.tickFormat(format);
            var xview = ctx.canvas.append("g").attr("class", "axis xaxis").attr("transform", "translate(0," + bottom + ")").call(xaxis), yview = ctx.canvas.append("g").attr("class", "axis yaxis").call(yaxis);
            arrange_category_axis(ctx, xaxis, xview);
            var text = xconfig.title();
            text && xview.append("text").attr("class", "title").attr("transform", "translate(" + ctx.width + ",0)").attr("y", 6).attr("dy", "-0.75em").style("text-anchor", "end").text(text), 
            text = yconfig.title(), text && yview.append("text").attr("class", "title").attr("transform", "rotate(-90)").attr("y", 3).attr("dy", ".75em").style("text-anchor", "end").text(text);
            var xbox = xview.node().getBBox(), ybox = yview.node().getBBox();
            return {
                width: ybox.width,
                height: xbox.height,
                views: {
                    x: xview,
                    y: yview
                }
            };
        };
    }("undefined" == typeof f3 ? window.f3 = {} : f3), function(ns) {
        "undefined" == typeof ns.chart && (ns.chart = {}), ns.chart.renderer = function(def) {
            var type = (def.type || "column").toLowerCase();
            switch (type) {
              case "line":
                return ns.line_chart();

              case "area":
                return ns.area_chart();

              case "cfd":
              case "cumulative-flow-diagram":
                return ns.cumulative_flow_diagram();

              default:
                return ns.bar_chart();
            }
        };
    }("undefined" == typeof f3 ? window.f3 = {} : f3), function(ns) {
        "undefined" == typeof ns.scale && (ns.scale = {}), ns.scale.scalar = function(ctx) {
            function time_ticks(vals) {
                if (ctx.period && ctx.period.step) switch (ctx.period.step.toLowerCase()) {
                  case "day":
                    return [ d3.time.days, 1 ];

                  case "month":
                    return [ d3.time.months, 1 ];

                  case "quarter":
                    return [ d3.time.months, 3 ];

                  case "year":
                    return [ d3.time.years, 1 ];

                  case "hour":
                    return [ d3.time.hours, 1 ];

                  case "minute":
                    return [ d3.time.minutes, 1 ];

                  case "second":
                    return [ d3.time.seconds, 1 ];
                }
                return vals.length;
            }
            function time_scale(axis, width, vals) {
                ctx.period && (vals = vals.concat([ ctx.period.min, ctx.period.max ].filter(ns.isDate))), 
                axis.ticks = time_ticks(vals);
                var extent = d3.extent(vals);
                return d3.time.scale().rangeRound([ 0, width ]).domain(extent);
            }
            function create(axis, width, vals) {
                return axis.is_time ? time_scale(axis, width, vals) : d3.scale.linear().rangeRound([ 0, width ]).domain(d3.extent(vals));
            }
            function add(axis, tick, interval) {
                return axis.is_time ? new Date(Number(tick) + interval) : tick + interval;
            }
            return function(width) {
                var axis_config = ctx.axes.x, scale = create(axis_config, width, ctx.categories);
                if (ctx.is_ordinal || axis_config.is_time) {
                    var axis = axis_config.create(ctx, scale), vals = ns.scale.ticks(scale, axis), interval = vals[1] - vals[0], cats = ctx.categories.slice();
                    return cats.splice(0, 0, add(vals[0], .9 * -interval)), ctx.is_ordinal && cats.push(add(axis_config, vals[vals.length - 1], .8 * interval)), 
                    create(axis_config, width, cats);
                }
                return scale;
            };
        };
    }("undefined" == typeof f3 ? window.f3 = {} : f3), function(ns) {
        "undefined" == typeof ns.chart && (ns.chart = {}), ns.chart.tip = function(ctx) {
            function series_index() {
                function parse(e) {
                    var series = e.data("series");
                    if (void 0 !== series) {
                        var i = parseInt(series);
                        return isNaN(i) ? void 0 : i;
                    }
                    return void 0;
                }
                var $this = $(this), val = parse($this);
                return void 0 !== val ? val : parse($this.parent("g[data-series]"));
            }
            var tip = d3.tip().attr("class", "d3-tip").offset([ -10, 0 ]).html(function(d) {
                var val = ns.title_attr(d.y, ctx.def.axes.y), text = val ? ns.sformat("<span style='color:red'>{0}</span>", val) : "", series = series_index.call(this), label = ctx.series[series], sep = text ? ":" : "";
                return label = label ? ns.sformat("<strong>{0}{1}</strong> ", label, sep) : "", 
                label + text;
            });
            return ctx.svg.call(tip), function() {
                d3.select(this).on("mouseover", tip.show).on("mouseout", tip.hide);
            };
        };
    }("undefined" == typeof f3 ? window.f3 = {} : f3), function(ns) {
        "undefined" == typeof ns.chart && (ns.chart = {}), ns.chart.title = function(ctx) {
            var def = ctx.def.title;
            if (!def || !def.text) return {
                element: null,
                height: 0
            };
            var element = $('<div class="title">').css("text-align", def.position || "center").text(def.text).appendTo($(ctx.container));
            return {
                element: element,
                height: element.outerHeight()
            };
        };
    }("undefined" == typeof f3 ? window.f3 = {} : f3), function(ns) {
        "undefined" == typeof ns.scale && (ns.scale = {}), ns.scale.ticks = function(scale, axis) {
            return scale.ticks ? scale.ticks.apply(scale, axis.ticks()) : scale.domain();
        }, ns.scale.ordinal = function(width, length) {
            return d3.scale.ordinal().rangeRoundBands([ 0, width ], .1).domain(d3.range(0, length));
        };
    }("undefined" == typeof f3 ? window.f3 = {} : f3);
}(window);