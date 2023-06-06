Component({
    properties: {
        data: {
            value: null,
            type: Object
        }
    },
    data: {},
    methods: {
        choose: function() {
            this.triggerEvent("chooseSpec", {});
        }
    }
});