({
    
    CONFIGURATION_PATH: "$Resource.KolobAgentIntegration_Configuration",
    
    RESPONSES:{
        CONFIGURATION:"configuration",
        CREDENTIALS:"credentials",
    },
    
    REACT_APP: "ReactApp",
    
    CONTROLLER_METHOD:{
        fetchUser: "c.fetchUser",
        insertCwData: "c.insertCwData",
    },

	onConfiguration : function(component) {
		window.fetch($A.get(this.CONFIGURATION_PATH))
        	.then((response) => {
            	return response.json();
            })
        	.then((myJson) => {
            	let reactMsg = {name: this.RESPONSES.CONFIGURATION};
                reactMsg.value = myJson;
                component.find(this.REACT_APP).message(reactMsg);
            });
	},
 
     onCredentials : function (component){
     	let action = component.get(this.CONTROLLER_METHOD.fetchUser);
     	action.setCallback(this, function(response) {
        	let state = response.getState();
            if (state === "SUCCESS") {
				let reactMsg = {name: this.RESPONSES.CREDENTIALS};
                reactMsg.value = response.getReturnValue();
                component.find(this.REACT_APP).message(reactMsg);
       		}
       	});  
        $A.enqueueAction(action);
    },

	onCwData : function (component, call){
    	let action = component.get("c.insertCwData");
        action.setParams({ callId :  call.id, callData: call.data });
     	action.setCallback(this, function(response) {
        	let state = response.getState();
            if (state === "SUCCESS") {
				/*Logica del cliente */
       		}

       	});  
        $A.enqueueAction(action);
	}
 
})