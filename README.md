### Boston Women's Workforce Council

This system implements Shamir's secret sharing with asymmetric key cryptography to aggregate and sum tables containing secret values. View this [notebook](https://github.com/ch3njust1n/cryptography/blob/main/Shamirs%20Secret%20Sharing.ipynb#enroll-beta) to learn more about Shamir's Secret Sharing.

### Setup
[Client README](client/README.md)

[Backend README](backend/README.md)

### Workflow

**1. Analyst: Login**
<img src="assets/1-auth.png" height=500>

**2. Analyst: Create session**
- Generates a keypair and sends the public key to the server where it can be retrieved by participants submitting data.
- The analyst must download the private key to their local system.
<img src="assets/2-start_session.png" height=500>

**3. Analyst: Generate submission URLs**
<img src="assets/3-get_submission_urls.png" height=500>

**4. Participant: Get prime and public key**
- Participant submits their table data. The client code then converts each cell into secret shares and encrypts 1 plus the threshold number of shares needed to decrypt. This prevents a malicious server from reconstructing the original tables.
<img src="assets/4-get_prime & get_public_key.png" height=500>

**5. Participant: Submits data**
- Check off the box that all data is correct.
- Click submit.
<img src="assets/5-submit_data.png" height=500>

**6. Analyst: View submission history**
- Client code periodically polls the server from submission history metadata.
<img src="assets/6-get_submission_history.png" height=500>

**7. Analyst: Stop session**
- When the analyst clicks stop, the backend sets a flag to disable any further submissions.
- The backend then merges all the tables together by adding the shares that are not encrypted with a participants private key.
<img src="assets/7-stop_session & get_submissions.png" height=500>

**8. Analyst: Get submissions**
- After clicking reveal results, the client changes views to the decryption page.
- The analyst opens their private key file to decrypt and then recombine the secret shares to get the actual summed results.
<img src="assets/8-decrypt.png" height=500>