var e = wx.getRealtimeLogManager ? wx.getRealtimeLogManager() : null;

module.exports = {
    debug: function() {
        e && e.debug.apply(e, arguments);
    },
    info: function() {
        e && e.info.apply(e, arguments);
    },
    warn: function() {
        e && e.warn.apply(e, arguments);
    },
    error: function() {
        e && e.error.apply(e, arguments);
    },
    setFilterMsg: function(t) {
        e && e.setFilterMsg && "string" == typeof t && e.setFilterMsg(t);
    },
    addFilterMsg: function(t) {
        e && e.addFilterMsg && "string" == typeof t && e.addFilterMsg(t);
    }
};