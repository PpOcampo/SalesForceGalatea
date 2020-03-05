({
	handleMessage : function(component, event, helper) {
		let payload = event.getParams().payload;
        let CW_EVENT = "LccEvent";
    	if(payload.event === CW_EVENT){
            switch(payload.value){
                case "GetConfig":
                    return helper.onConfiguration(component);
                case "GetCredentials":
                    return helper.onCredentials(component);
                case "onCwData":
                    return helper.onCwData(component, payload.call);
                
            } 
		}
	},
                      
    handleError: function(component, error, helper) {
        console.log("SALESFORCE ERROR===>", error);
	}
})