OddsEvent = {
    PageParameters: "",
    PageParametersJson: "",
    GetDataEvent: function(pId, pView, pBookId, pConsensusBookId, pPeriodTypeId, pMatchupLink) {
        var divId = "#eventBox-" + pId + ".eventBox";
        if ("onRequest" != jQuery(divId).data("status")) {
            jQuery(divId).data("status", "onRequest");
            var theme = "Blue";
            switch (pView) {
                case "CO":
                    OddsEvent.UpdateMainColumn("/ajax/?a=[SBR.Odds.Modules]OddsEvent_GetConsensus", divId, pId, pView, pBookId, pBookId, "", null, pConsensusBookId, pPeriodTypeId, pMatchupLink, theme);
                    break;
                case "ED":
                    OddsEvent.UpdateMainColumn("/ajax/?a=[SBR.Odds.Modules]OddsEvent_GetEvent", divId, pId, pView, pBookId, pBookId, "", null, pConsensusBookId, pPeriodTypeId, pMatchupLink, theme);
                    break;
                case "LH":
                    OddsEvent.UpdateMainColumn("/ajax/?a=[SBR.Odds.Modules]OddsEvent_GetLinesHistory", divId, pId, pView, pBookId, pBookId, "", null, pConsensusBookId, pPeriodTypeId, pMatchupLink, theme);
                    break;
                case "IN":
                    OddsEvent.UpdateMainColumn("/ajax/?a=[SBR.Odds.Modules]OddsEvent_GetInjuries", divId, pId, pView, pBookId, pBookId, "", null, pConsensusBookId, pPeriodTypeId, pMatchupLink, theme)
            }
        }
    },
    GetLinesHistory: function(pId, pView, pBookId, pDefaultBookId, obj, pConsensusBookId, pPeriodTypeId, pMatchupLink) {
        var divId = "#eventBox-" + pId + ".eventBox";
        OddsEvent.UpdateMainColumn("/ajax/?a=[SBR.Odds.Modules]OddsEvent_GetLinesHistory", divId, pId, pView, pBookId, pDefaultBookId, "div.history", function(t) {
            null != obj && ($(obj).parents("ul").find(".historyCarousel-current").removeClass("historyCarousel-current"), $(obj).parent().addClass("historyCarousel-current"));
            var p = $("div.history", $(t)),
                u = $("div.history", $(divId));
            u.html(p.html()), $("div.scrollbar").jScrollPane(), $(divId).find("a.refresh").attr("bookId", pBookId)
        }, pConsensusBookId, pPeriodTypeId, pMatchupLink, _THEME)
    },
    UpdateMainColumn: function(pUrl, pDiv, pId, pView, pBookId, pDefaultBookId, pClearSelector, fComplete, pConsensusBookId, pPeriodTypeId, pMatchupLink, theme) {
        $.ajax({
            url: 'https://classic.sportsbookreview.com/ajax/?a=[SBR.Odds.Modules]OddsEvent_GetConsensus',
            data: {
                UserId: 0,
                Sport: 'baseball',
                League: 'MLB',
                EventId: pId,
                View: pView,
                SportsbookId: pBookId,
                DefaultBookId: pDefaultBookId,
                ConsensusBookId: pConsensusBookId,
                PeriodTypeId: pPeriodTypeId,
                StartDate: '2018-09-20',
                MatchupLink: pMatchupLink,
                Key: '3fc3558a1d849da176cca3e0b976f45d',
                theme: theme
            },
            crossDomain: true,
            type: "Post",
            success: function(t) {
                "Done." != t ? fComplete ? fComplete(t) : $(pDiv).html(t) : $(pDiv).html("No information avalaible.")
            },
            complete: function(t) {
                jQuery(pDiv).data("status", "")
            },
            error: function(XMLHttpRequest, status, error) {
                jQuery(pDiv).data("status", "")
            }
        })
    },
    ChangeStatusBox: function(action, pBoxId) {
        for (var gridId = "#info-grid-" + pBoxId, idRef = parseInt(pBoxId), otherIds = "", i = 1; 3 >= i; i++) idRef != i && ("" != otherIds && (otherIds += ","), otherIds += i);
        if (otherIds.length > 0)
            for (var ids = otherIds.split(","), limit = ids.length, index = 0; limit > index; index++) {
                var groupLineId = "#info-grid-" + ids[index];
                "undefined" != typeof groupLineId && null != groupLineId && (jQuery(groupLineId).removeClass("open").addClass("close"), jQuery("div.option").each(function() {
                    jQuery(this).html("+")
                }))
            }
        var gridRef = jQuery(gridId);
        "undefined" != typeof gridRef && null != gridRef && (jQuery(gridRef).hasClass("open") ? (jQuery(gridRef).removeClass("open").addClass("close"), jQuery(action).html("+")) : (jQuery(gridRef).removeClass("close").addClass("open"), jQuery(action).html("-")))
    },
    closeBox: function(elem) {
        var parent = $(elem).parents("div.eventBox");
        parent.slideUp("fast", function() {
            parent.html("")
        })
    }
}, OddsEvent.GetGridScoreboard = function(obj, seasonId, date, key) {
    var cal = $("div#calendar-holder", $(obj).parents("div.dd-holder")),
        gettingCalendar = cal.data("getting-calendar") || !1;
    gettingCalendar || (cal.data("getting-calendar", !0), leagueKey = $("#superbar-holder").find("div.options span#item1").attr("rel"), $.ajax({
        url: "/ajax/?a=[SBR.Odds.Modules]OddsEvent_GetCalendar",
        type: "POST",
        dataType: "json",
        data: {
            sbr_user_id: _USERID,
            seasonId: seasonId,
            date: date,
            league: key,
            leagueKey: leagueKey
        },
        success: function(t) {
            200 == t.status && cal.html(t.html)
        },
        complete: function(t) {
            cal.data("getting-calendar", !1)
        },
        error: function(t) {
            cal.html("An error occurred loading schedule.")
        }
    }))
}, OddsEvent.GetLinkDate = function(obj, str) {
    var baseUrl = "/(es/)?(betting-odds/)(.+/)?((?:pointspread|money-line|totals)/)?((?:1st|2nd|3rd|4th)-(?:quarter|half)/)?",
        t = new Date,
        ty = t.getFullYear(),
        tm = t.getMonth() + 1,
        td = t.getDate(),
        twochar = function(n) {
            var n = "0000" + n;
            return n.substring(n.length - 2, n.length)
        },
        today = ty + "" + twochar(tm) + twochar(td),
        path = window.location.pathname,
        query = window.location.search;
    if (str == today) {
        var newquery = query.replace(/date=\d{8}/gi, "");
        return void(window.location = path + ("?" == newquery ? "" : newquery))
    }
    if (query.match(/(\d+){8}/i)) {
        var loc = path + query.replace(/(\d+){8}/, str);
        return void(window.location = loc)
    }
    var reg = new RegExp(baseUrl, "i"),
        match = reg.exec(path);
    if (null != match) {
        var path = "/" + (match[1] || "") + (match[2] || "") + (match[3] || "") + (match[4] || "") + (match[5] || ""),
            search = (window.location.search.length > 0 ? window.location.search + "&" : "?") + "date=" + str;
        window.location = path + search
    }
}, OddsEvent.OnCarouselScroll = function(carousel, currentPage, obj, state) {
    if (!OddsEvent.AjaxLocked) {
        OddsEvent.AjaxLocked = !0;
        var timestamps = FeedManager.GetTimeStampsCollection();
        return $.ajax({
            url: "/ajax/?a=[SBR.Odds.Modules]OddsGrid_GetPage",
            data: {
                sbr_user_id: _USERID,
                page: currentPage + 1,
                params: OddsEvent.PageParameters,
                timestamps: timestamps
            },
            type: "Post",
            beforeSend: function() {
                jQuery("#loadingMessage").show()
            },
            success: function(t) {
                jQuery("#oddsGridContainer").html(t), GridOddsModuleHandler.staggeredColors()
            },
            complete: function(t) {
                jQuery("#loadingMessage").hide(), OddsEvent.AjaxLocked = !1, carousel && carousel.finish(), currentPage + 1 > 1 && jQuery("div.scoreboxToggle").parent().addClass("min"), GridOddsModuleHandler.initGridModuleEvents()
            },
            error: function(XMLHttpRequest, status, error) {}
        }), !1
    }
};
