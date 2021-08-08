# Perun

---

## Warning!

Perun does **NOT** currently offer **ANY** authentication.

All API calls, irrespective of where they originate from, will be treated as valid so long as they are valid per the API spec.

It is thus recommended to **block incoming traffic** on the default Perun port (3000).

---

## Description

A nodejs module to interact with an LND node using a REST API.

---

Initial project functionality requirements:

- [x] Create a REST API which allows to:
  - [x] Export transactions to CSV
  - [x] Delete old transactions


---

## API overview

| RESTful call        | LND call                  | Action                                                     |
|---------------------|---------------------------|------------------------------------------------------------|
| `GET /payments`     | `POST /ListPayments`      | Returns JSON of outgoing payments                          |
| `GET /payments/csv` | unsupported               | Returns simplified list of outgoing payments in CSV format |
| `DELETE /payments`  | `POST /DeleteAllPayments` | Deletes history of outgoing payments                       |

- Parameters should only be sent in the request body.
- Parameters not matching an API call spec will be ignored.

---

## API detailed specs

###     `GET /payments`

####    LND API equivalent:
`POST /ListPayments`

####    Action:
Returns JSON of outgoing payments.

####    Parameters
|Name               |Default value  |
|-------------------|---------------|
|include_incomplete |`true`         |
|index_offset       |`0`            |
|max_payments       |`0`            |
|offset             |`false`        |

####    Response
Returns a JSON consisting of:
- payments - array of Payment objects as defined in LND API docs
- first_index_offset
- last_index_offset

---

###     `GET /payments/csv`

####    LND API equivalent:
unsupported

####    Action:
Returns simplified list of outgoing payments in CSV format.

####    Parameters
Same as `GET /payments`

####    Response
The following fields in CSV format:
- payment_hash
- payment_preimage
- value_sat
- value_msat
- payment_request
- fee_sat
- fee_msat
- creation_time_ns
- payment_index

Notice:
Basically returns serializable, non-deprecated, fields.

---

###     `DELETE /payments`

####    LND API equivalent:
`POST /DeleteAllPayments`

####    Action:
Deletes history of outgoing payments.

####    Parameters
|Name                   |Default value  |
|-----------------------|---------------|
|failed_payments_only   |`true`         |
|failed_htlcs_only      |`true`         |

####    Response
None

---

## Code name

Perun (sometimes Grom) is the name of the god of lightning and thunder in Slavic mythology.

![Perun the Thunderer by Andrey Shishkin](https://upload.wikimedia.org/wikipedia/commons/4/46/Perun_Gromoverzhecz_by_Andrey_Shishkin.jpg "Perun the Thunderer by Andrey Shishkin")
