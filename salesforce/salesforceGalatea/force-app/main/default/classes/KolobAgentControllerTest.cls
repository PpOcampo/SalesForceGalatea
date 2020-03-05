@isTest
private class KolobAgentControllerTest {
    @isTest static void testUserId() {
        User user1= KolobAgentController.fetchUser();
    }
    
    @isTest static void insertCwData() {
        String [] data=new String[]{'Dato1','Dato2','Dato3','Dato4','Dato5'};
        KolobAgentController.insertCwData('1234',data);
    }
}