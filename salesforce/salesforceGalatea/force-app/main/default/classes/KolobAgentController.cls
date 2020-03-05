public with sharing class KolobAgentController {
	@AuraEnabled 
    public static user fetchUser(){
      User oUser = [select id,Username FROM User Where id =: userInfo.getUserId()];
      return oUser;
    }
    
    @AuraEnabled 
    public static void insertCwData(String callId, String[] callData){
      CWData__c data = new CWData__c();
      data.Name = callId;
      data.Data1__c = String.isEmpty(callData[0]) ? '':callData[0];
      data.Data2__c = String.isEmpty(callData[1]) ? '':callData[1];
      data.Data3__c = String.isEmpty(callData[2]) ? '':callData[2];
      data.Data4__c = String.isEmpty(callData[3]) ? '':callData[3];
      data.Data5__c = String.isEmpty(callData[4]) ? '':callData[4];
      insert data;
    }
    
}