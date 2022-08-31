<template>
  <div>
    <div v-if="isLoading" class="body-loading">
      <div class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
    </div>
    <div class="profile__main-body" :class="{'is-loading': isLoading}">
      <div class="new-payment-method-c">
        <h2>Add new payment method</h2>
        <form id='chargify-form' @submit="submitChargify">
          <div class="vip-billing-details-form">
            <input type="text" v-model="firstName" class="vip-input vip-input--row" placeholder="First Name" data-recurly="first_name">
            <input type="text" v-model="lastName" class="vip-input vip-input--row" placeholder="Last Name" data-recurly="last_name">
            <div class="chargify-element">
              <div id="chargify1" ref="chargifyelements1">
                <!-- Chargify elements will be attached here CARD NUMBER -->
              </div>
              <div id="chargify2" ref="chargifyelements2">
                <!-- Chargify elements will be attached here MONTH -->
              </div>
              <div id="chargify3" ref="chargifyelements3">
                <!-- Chargify elements will be attached here YEAR -->
              </div>
              <div id="chargify4" ref="chargifyelements4">
                <!-- Chargify elements will be attached here CVV -->
              </div>
              <div class="host-field">
                <input type="hidden" class="host-input" data-chargify="country" :value="country"/>
              </div>
            </div>
            <div class="chargify-element">
              <div id="chargify5" ref="chargifyelements5">
                <!-- Chargify elements will be attached here ZIP -->
              </div>
            </div>
            <div class="chargify-element">
              <div class="acc-input-wrap acc-input-wrap--hasselect">
                <select class="acc-input acc-input--editable" :class="{'is-placeholder': !country}" v-model="country">
                  <option value="" disabled>Country</option>
                  <option value="AX">Åland Islands</option>
                  <option value="AL">Albania</option>
                  <option value="AS">American Samoa</option>
                  <option value="AD">Andorra</option>
                  <option value="AI">Anguilla</option>
                  <option value="AQ">Antarctica</option>
                  <option value="AG">Antigua and Barbuda</option>
                  <option value="AR">Argentina</option>
                  <option value="AM">Armenia</option>
                  <option value="AW">Aruba</option>
                  <option value="AU">Australia</option>
                  <option value="AT">Austria</option>
                  <option value="AZ">Azerbaijan</option>
                  <option value="BS">Bahamas</option>
                  <option value="BH">Bahrain</option>
                  <option value="BD">Bangladesh</option>
                  <option value="BB">Barbados</option>
                  <option value="BE">Belgium</option>
                  <option value="BZ">Belize</option>
                  <option value="BJ">Benin</option>
                  <option value="BM">Bermuda</option>
                  <option value="BT">Bhutan</option>
                  <option value="BO">Bolivia, Plurinational State of</option>
                  <option value="BQ">Bonaire, Sint Eustatius and Saba</option>
                  <option value="BA">Bosnia and Herzegovina</option>
                  <option value="BW">Botswana</option>
                  <option value="BV">Bouvet Island</option>
                  <option value="BR">Brazil</option>
                  <option value="IO">British Indian Ocean Territory</option>
                  <option value="BN">Brunei Darussalam</option>
                  <option value="BG">Bulgaria</option>
                  <option value="BF">Burkina Faso</option>
                  <option value="BI">Burundi</option>
                  <option value="KH">Cambodia</option>
                  <option value="CM">Cameroon</option>
                  <option value="CA">Canada</option>
                  <option value="CV">Cape Verde</option>
                  <option value="KY">Cayman Islands</option>
                  <option value="TD">Chad</option>
                  <option value="CL">Chile</option>
                  <option value="CN">China</option>
                  <option value="CX">Christmas Island</option>
                  <option value="CC">Cocos (Keeling) Islands</option>
                  <option value="CO">Colombia</option>
                  <option value="KM">Comoros</option>
                  <option value="CG">Congo</option>
                  <option value="CK">Cook Islands</option>
                  <option value="CR">Costa Rica</option>
                  <option value="CI">Côte d'Ivoire</option>
                  <option value="HR">Croatia</option>
                  <option value="CW">Curaçao</option>
                  <option value="CY">Cyprus</option>
                  <option value="CZ">Czech Republic</option>
                  <option value="DK">Denmark</option>
                  <option value="DJ">Djibouti</option>
                  <option value="DM">Dominica</option>
                  <option value="DO">Dominican Republic</option>
                  <option value="EC">Ecuador</option>
                  <option value="EG">Egypt</option>
                  <option value="SV">El Salvador</option>
                  <option value="GQ">Equatorial Guinea</option>
                  <option value="EE">Estonia</option>
                  <option value="ET">Ethiopia</option>
                  <option value="FK">Falkland Islands (Malvinas)</option>
                  <option value="FO">Faroe Islands</option>
                  <option value="FJ">Fiji</option>
                  <option value="FI">Finland</option>
                  <option value="FR">France</option>
                  <option value="GF">French Guiana</option>
                  <option value="PF">French Polynesia</option>
                  <option value="TF">French Southern Territories</option>
                  <option value="GA">Gabon</option>
                  <option value="GM">Gambia</option>
                  <option value="GE">Georgia</option>
                  <option value="DE">Germany</option>
                  <option value="GH">Ghana</option>
                  <option value="GI">Gibraltar</option>
                  <option value="GR">Greece</option>
                  <option value="GL">Greenland</option>
                  <option value="GD">Grenada</option>
                  <option value="GP">Guadeloupe</option>
                  <option value="GU">Guam</option>
                  <option value="GT">Guatemala</option>
                  <option value="GG">Guernsey</option>
                  <option value="GN">Guinea</option>
                  <option value="GW">Guinea-Bissau</option>
                  <option value="GY">Guyana</option>
                  <option value="HM">Heard Island and McDonald Islands</option>
                  <option value="HN">Honduras</option>
                  <option value="HK">Hong Kong</option>
                  <option value="HU">Hungary</option>
                  <option value="IS">Iceland</option>
                  <option value="IN">India</option>
                  <option value="ID">Indonesia</option>
                  <option value="IM">Isle of Man</option>
                  <option value="IL">Israel</option>
                  <option value="IT">Italy</option>
                  <option value="JM">Jamaica</option>
                  <option value="JP">Japan</option>
                  <option value="JE">Jersey</option>
                  <option value="JO">Jordan</option>
                  <option value="KZ">Kazakhstan</option>
                  <option value="KE">Kenya</option>
                  <option value="KI">Kiribati</option>
                  <option value="KR">Korea, Republic of</option>
                  <option value="KW">Kuwait</option>
                  <option value="LA">Lao People's Democratic Republic</option>
                  <option value="LV">Latvia</option>
                  <option value="LS">Lesotho</option>
                  <option value="LR">Liberia</option>
                  <option value="LY">Libya</option>
                  <option value="LI">Liechtenstein</option>
                  <option value="LT">Lithuania</option>
                  <option value="LU">Luxembourg</option>
                  <option value="MO">Macao</option>
                  <option value="MK">Macedonia, the former Yugoslav Republic of</option>
                  <option value="MG">Madagascar</option>
                  <option value="MW">Malawi</option>
                  <option value="MY">Malaysia</option>
                  <option value="MV">Maldives</option>
                  <option value="ML">Mali</option>
                  <option value="MT">Malta</option>
                  <option value="MH">Marshall Islands</option>
                  <option value="MQ">Martinique</option>
                  <option value="MR">Mauritania</option>
                  <option value="MU">Mauritius</option>
                  <option value="YT">Mayotte</option>
                  <option value="MX">Mexico</option>
                  <option value="FM">Micronesia, Federated States of</option>
                  <option value="MD">Moldova, Republic of</option>
                  <option value="MC">Monaco</option>
                  <option value="MN">Mongolia</option>
                  <option value="ME">Montenegro</option>
                  <option value="MS">Montserrat</option>
                  <option value="MA">Morocco</option>
                  <option value="MZ">Mozambique</option>
                  <option value="NA">Namibia</option>
                  <option value="NR">Nauru</option>
                  <option value="NP">Nepal</option>
                  <option value="NL">Netherlands</option>
                  <option value="NC">New Caledonia</option>
                  <option value="NZ">New Zealand</option>
                  <option value="NI">Nicaragua</option>
                  <option value="NE">Niger</option>
                  <option value="NG">Nigeria</option>
                  <option value="NU">Niue</option>
                  <option value="NF">Norfolk Island</option>
                  <option value="MP">Northern Mariana Islands</option>
                  <option value="NO">Norway</option>
                  <option value="OM">Oman</option>
                  <option value="PK">Pakistan</option>
                  <option value="PW">Palau</option>
                  <option value="PA">Panama</option>
                  <option value="PG">Papua New Guinea</option>
                  <option value="PY">Paraguay</option>
                  <option value="PE">Peru</option>
                  <option value="PH">Philippines</option>
                  <option value="PN">Pitcairn</option>
                  <option value="PL">Poland</option>
                  <option value="PT">Portugal</option>
                  <option value="PR">Puerto Rico</option>
                  <option value="QA">Qatar</option>
                  <option value="RE">Réunion</option>
                  <option value="RO">Romania</option>
                  <option value="RU">Russian Federation</option>
                  <option value="BL">Saint Barthélemy</option>
                  <option value="SH">Saint Helena, Ascension and Tristan da Cunha</option>
                  <option value="KN">Saint Kitts and Nevis</option>
                  <option value="LC">Saint Lucia</option>
                  <option value="MF">Saint Martin (French part)</option>
                  <option value="PM">Saint Pierre and Miquelon</option>
                  <option value="VC">Saint Vincent and the Grenadines</option>
                  <option value="WS">Samoa</option>
                  <option value="SM">San Marino</option>
                  <option value="ST">Sao Tome and Principe</option>
                  <option value="SA">Saudi Arabia</option>
                  <option value="SN">Senegal</option>
                  <option value="RS">Serbia</option>
                  <option value="SC">Seychelles</option>
                  <option value="SG">Singapore</option>
                  <option value="SX">Sint Maarten (Dutch part)</option>
                  <option value="SK">Slovakia</option>
                  <option value="SI">Slovenia</option>
                  <option value="SB">Solomon Islands</option>
                  <option value="ZA">South Africa</option>
                  <option value="GS">South Georgia and the South Sandwich Islands</option>
                  <option value="ES">Spain</option>
                  <option value="LK">Sri Lanka</option>
                  <option value="SR">Suriname</option>
                  <option value="SJ">Svalbard and Jan Mayen</option>
                  <option value="SZ">Swaziland</option>
                  <option value="SE">Sweden</option>
                  <option value="CH">Switzerland</option>
                  <option value="TW">Taiwan, Province of China</option>
                  <option value="TJ">Tajikistan</option>
                  <option value="TZ">Tanzania, United Republic of</option>
                  <option value="TH">Thailand</option>
                  <option value="TL">Timor-Leste</option>
                  <option value="TG">Togo</option>
                  <option value="TK">Tokelau</option>
                  <option value="TO">Tonga</option>
                  <option value="TT">Trinidad and Tobago</option>
                  <option value="TN">Tunisia</option>
                  <option value="TR">Turkey</option>
                  <option value="TM">Turkmenistan</option>
                  <option value="TC">Turks and Caicos Islands</option>
                  <option value="TV">Tuvalu</option>
                  <option value="UG">Uganda</option>
                  <option value="UA">Ukraine</option>
                  <option value="AE">United Arab Emirates</option>
                  <option value="GB">United Kingdom</option>
                  <option value="US">United States</option>
                  <option value="UM">United States Minor Outlying Islands</option>
                  <option value="UY">Uruguay</option>
                  <option value="UZ">Uzbekistan</option>
                  <option value="VU">Vanuatu</option>
                  <option value="VN">Viet Nam</option>
                  <option value="VG">Virgin Islands, British</option>
                  <option value="VI">Virgin Islands, U.S.</option>
                  <option value="WF">Wallis and Futuna</option>
                  <option value="EH">Western Sahara</option>
                  <option value="ZM">Zambia</option>
                </select>
              </div>
            </div>
          </div>
          <div class="vip-checkout">
            <div class="vip-checkout__button">
              <input id="chargify-token" type="hidden" />
              <Button text="Add New Card" variant="rounded-blue"/>
            </div>
            <p><router-link :to="{ name: 'Profile' }">Cancel</router-link></p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/global/Button.vue';
// import Badge from '@/components/global/Badge.vue';

export default {
  name: 'NewPaymentMethod',
  components: {
    Button,
    // Badge,
  },
  data() {
    return {
      isLoading: false,
      firstName: '',
      lastName: '',
      token: '',
      chargify: null,
      country: '',
      paymentMethod: null,
    };
  },
  computed: {
    userData() {
      return this.$store.state.auth.userData;
    },
  },
  watch: {
    //
  },
  mounted() {
    this.mountChargify();
    if (typeof this.userData.country !== 'undefined' && this.userData.country) {
      this.country = this.userData.country;
    }
  },
  beforeDestroy() {
    this.destroyChargify();
  },
  methods: {
    destroyChargify() {
      if (this.chargify) {
        this.chargify.unload();
      }
      this.chargify = null;
    },
    mountChargify() {
      this.chargify = new window.Chargify();
      this.chargify.load({
        selector: '#chargify1',
        publicKey: process.env.VUE_APP_CHARGIFY_PUBLICKEY,
        type: 'card',
        serverHost: `https://${process.env.VUE_APP_CHARGIFY_SUBDOMAIN}.chargify.com`,
        hideCardImage: true,
        fields: {
          number: {
            selector: '#chargify1',
          },
          month: {
            selector: '#chargify2',
          },
          year: {
            selector: '#chargify3',
          },
          cvv: {
            selector: '#chargify4',
            required: true,
          },
          zip: {
            selector: '#chargify5',
            required: true,
            placeholder: 'Zip/Postal Code',
          },
          // country: {
          //   selector: '#chargify5',
          //   required: true,
          //   placeholder: 'Country',
          //   maxlength: 2,
          // },
        },
        style: {
          '#chargify1': {
            backgroundColor: 'transparent',
          },
          label: {
            backgroundColor: 'transparent',
            display: 'none',
          },
          field: {
            backgroundColor: 'transparent',
            borderRadius: '0',
            margin: '0',
          },
          input: {
            backgroundColor: 'transparent',
            border: '0',
            paddingTop: '2px',
            paddingBottom: '1px',
            placeholder: { color: '#7474AD' },
            color: '#FFFFFF',
            fontSize: '12px',
            fontWeight: '600',
            padding: '.75rem',
            lineHeight: '1',
          },
        },
      });
    },
    submitChargify(e) {
      e.preventDefault();
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;
      this.chargify.token(
        e.target,
        (token) => {
          const srvReqParams = {
            token,
            firstName: this.firstName,
            lastName: this.lastName,
          };
          this.$api.post('/payment/method', srvReqParams)
            .then(() => {
              this.$noty.success('Success!');
              this.$router.replace({ name: 'Profile' });
            })
            .catch((error) => {
              console.error(error);
              this.isLoading = false;
            });
        },
        (err) => {
          console.log('token ERROR - err: ', err);
          if (err.message) {
            this.$noty.error(err.message);
          } else if (err.errors) {
            this.$noty.error(typeof err.errors === 'string' ? err.errors : err.errors[0]);
          }
          this.isLoading = false;
        },
      );
    },
  },
};
</script>

<style scoped lang="scss">
.new-payment-method-c {
  width: 500px;
  max-width: 100%;
  margin: 2rem auto 0 auto;
  text-align: center;
  position: relative;
}
.body-loading {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  z-index: 9;
}
.panel__col.col-middle {
  position: relative;
}
.is-loading.profile__main-body {
  opacity: 0.1;
}
//
h2 {
  margin-bottom: 1rem;
}
.vip-input {
  font-size: 12px;
  font-weight: 600;
  padding: .75rem;
  width: 100%;
  background-color: $light-navy;
  color: #fff;
  border-radius: 0 !important;
  &::placeholder {
    color: $kimberly;
    font-weight: 500;
  }
}
.vip-input--row:not(:last-child) {
  margin-bottom: .5rem;
}
.vip-input-grp {
  display: flex;
  justify-content: space-between;
  .vip-input {
    flex-basis: calc(50% - .25rem);
  }
}
/deep/ .recurly-element {
  border: 0;
  background-color: $light-navy;
  color: $kimberly;
  border-radius: 0 !important;
  margin-bottom: .5rem;
  height: 38px;
}
/deep/ .chargify-element {
  border: 0;
  background-color: $light-navy;
  color: $kimberly;
  border-radius: 0 !important;
  margin-bottom: .5rem;
  height: 38px;
  display: flex;
  width: 100%;
  max-width: 100%;
}
/deep/ #chargify1 iframe,
/deep/ #chargify2 iframe,
/deep/ #chargify3 iframe,
/deep/ #chargify4 iframe,
/deep/ #chargify5 iframe {
  width: 100% !important;
  height: 38px !important;
}
#chargify1 {
  flex: 5;
}
#chargify2 {
  flex: 1;
  min-width: 45px;
  max-width: 50px;
}
#chargify3 {
  flex: 1;
  min-width: 58px;
}
#chargify4 {
  flex: 1;
  min-width: 50px;
}
select.acc-input.acc-input--editable.is-placeholder {
  color: $kimberly;
  font-weight: 500;
}
select.acc-input {
  cursor: pointer;
  display: block;
  max-width: 100%;
  outline: 0;
  -webkit-appearance: none;
  box-shadow: none;
  border: none;
  background-color: $light-navy;
  color: #fff;
  height: 100%;
  padding: .75rem;
  font-size: 12px;
  font-weight: 600;
  flex: 1;
}
.acc-input-wrap--hasselect {
  position: relative;
  display: flex;
  flex: 1;
  &::after {
    right: 1.125em;
    z-index: 4;
    border: 3px solid $kimberly;
    border-radius: 2px;
    border-right: 0;
    border-top: 0;
    content: " ";
    display: block;
    height: .625em;
    margin-top: -.4375em;
    pointer-events: none;
    position: absolute;
    top: 50%;
    transform: rotate(-45deg);
    transform-origin: center;
    width: .625em;
  }
}
.vip-checkout {
  margin-top: 2rem;
}
.vip-checkout__button {
  display: flex;
  margin-bottom: 1rem;
}

@media (max-width: 1279px) {
  .new-payment-method-c {
    margin-top: 1rem;
  }
}
</style>
