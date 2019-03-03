import smtplib
import sys
from email.MIMEMultipart import MIMEMultipart
from email.MIMEText import MIMEText

server = smtplib.SMTP('smtp.gmail.com', 587);
server.ehlo()
server.starttls()
#Next, log in to the server
emailSender = "learn2earnbyrajnish@gmail.com"
emailPass = "amlesh555."
server.login(emailSender, emailPass)


#print sys.argv
emailSendTo = sys.argv[1]
emailSubject = sys.argv[2]
emailBody = sys.argv[3]

fromaddr = emailSender
toaddr = emailSendTo
msg = MIMEMultipart()
msg['From'] = fromaddr
msg['To'] = toaddr
msg['Subject'] = emailSubject
msg.attach(MIMEText(emailBody, 'plain')) # setting mail body

text = msg.as_string()

#Send the mail
#msg = "Hello!"; # The /n separates the message from the headers
#msg = sys.argv[2]
server.sendmail(emailSender, [emailSendTo, emailSender], text)