# Download the helper library from https://www.twilio.com/docs/python/install
import os
from twilio.rest import Client


#twilio API integration - from site
account_sid = 'AC24c974847f9bdcd9247c88ddf64df675'
auth_token = '5cda0eb1b7a3348d82935d941f3f0e32'
client = Client(account_sid, auth_token)


verification = client.verify \
    .v2 \
    .services('VAea5cf22f2a59e8d369b782f3557f8789') \
    .verifications \
    .create(to='+16476796931', channel='sms')


print(verification.sid)


verification_check = client.verify.v2.services(
    "VAea5cf22f2a59e8d369b782f3557f8789"
).verification_checks.create(to="+16476796931", code="123456")

<<<<<<< HEAD
print(verification_check.status)



# range - this based off boolean variable name = isInRange 

#range 
# Find your Account SID and Auth Token at twilio.com/console
# and set the environment variables. See http://twil.io/secure

if isInRange == False:
    message = client.messages.create(
        body="Patient is out of range",
        from_="+12893019431",
        to="+16476796931",
    )
    print(message.body)
=======

print(verification_check.status)


#range
# Find your Account SID and Auth Token at twilio.com/console
# and set the environment variables. See http://twil.io/secure


message = client.messages.create(
    body="Patient is out of range",
    from_="+12893019431",
    to="+16476796931",
)


print(message.body)
>>>>>>> main
