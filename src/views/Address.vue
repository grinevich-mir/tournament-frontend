<template>
  <div class="profile__main-body" :class="{ embed: !!submitCallback }">
    <div class="acc-info">
      <p class="acc-info__title">{{ title || 'Identity Verification' }}</p>
      <p class="acc-info__desc" v-if="desc">{{desc}}</p>
      <form v-if="step === 1" class="t-form acc-inputs" method="post" :class="{ 'is-loading': isProcessing }" @submit.prevent="updateProfile" autocomplete="off">
        <!-- ADDRESS LINE 1 -->
        <div class="acc-input-wrap" v-if="!partial">
          <template v-if="!isLoading">
            <input
              class="acc-input acc-input--editable"
              type="text"
              placeholder="Street Address line 1*"
              v-model="updateProfileObj.address.line1"
              :class="{ 'error' : errors.line1.length }"
              @input="isValid('line1')"
            >
            <ul v-if="errors.line1.length" class="errors">
              <li v-for="(error, index) in errors.line1" :key="`line1-error-${index}`">{{ error }}</li>
            </ul>
          </template>
          <div v-else class="ldr" style="width: 100%; height: 45px"></div>
        </div>
        <!-- ADDRESS LINE 2 -->
        <div class="acc-input-wrap" v-if="!partial">
          <input v-if="!isLoading" class="acc-input acc-input--editable" type="text" placeholder="Street Address line 2" v-model="updateProfileObj.address.line2">
          <div v-else class="ldr" style="width: 100%; height: 45px"></div>
        </div>
        <!-- ZIP CODE -->
        <div class="acc-input-wrap">
          <template v-if="!isLoading">
            <input
              class="acc-input acc-input--editable"
              type="text"
              placeholder="Zip Code*"
              v-model="updateProfileObj.address.zipCode"
              :class="{ 'error' : errors.zipCode.length }"
              @input="isValid('zipCode')"
            >
            <ul v-if="errors.zipCode.length" class="errors">
              <li v-for="(error, index) in errors.zipCode" :key="`zipcode-error-${index}`">{{ error }}</li>
            </ul>
          </template>
          <div v-else class="ldr" style="width: 100%; height: 45px"></div>
        </div>
        <!-- CITY -->
        <div class="acc-input-wrap" v-if="!partial">
          <template v-if="!isLoading">
            <input
              class="acc-input acc-input--editable"
              type="text"
              placeholder="City*"
              v-model="updateProfileObj.address.city"
              :class="{ 'error' : errors.city.length }"
              @input="isValid('city')"
            >
            <ul v-if="errors.city.length" class="errors">
              <li v-for="(error, index) in errors.city" :key="`city-error-${index}`">{{ error }}</li>
            </ul>
          </template>
          <div v-else class="ldr" style="width: 100%; height: 45px"></div>
        </div>
        <!-- STATE -->
        <div class="acc-input-wrap" v-if="!partial">
          <input v-if="!isLoading" class="acc-input acc-input--editable" type="text" placeholder="State" v-model="updateProfileObj.address.state">
          <div v-else class="ldr" style="width: 100%; height: 45px"></div>
        </div>
        <!-- COUNTRY -->
        <div class="acc-input-wrap acc-input-wrap--hasselect">
          <template v-if="!isLoading">
            <select
              class="acc-input acc-input--editable"
              v-model="updateProfileObj.address.country"
              :class="{ 'is-placeholder': !updateProfileObj.address.country, 'error' : errors.country.length }"
              @change="isValid('country')"
            >
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
            <ul v-if="errors.country.length" class="errors">
              <li v-for="(error, index) in errors.country" :key="`country-error-${index}`">{{ error }}</li>
            </ul>
          </template>
          <div v-else class="ldr" style="width: 100%; height: 45px"></div>
        </div>
        <div class="acc-inputs-footer">
          <Button variant="underlined-white" text="Cancel" @clicked="cancelAction"/>
          <Button
            variant="rounded-blue"
            type="submit"
            text="Proceed"
            :disabled="!formIsValid"
          />
        </div>
      </form>
      <!-- 2 -->
      <form v-if="step === 2" class="t-form acc-inputs" method="post" :class="{ 'is-loading': isProcessing }" @submit.prevent="" autocomplete="off">
        <div class="acc-input-wrap">
          <select class="acc-input acc-input--editable" v-model="verifyDocType">
            <option value="" disabled>Select document to upload</option>
            <option value="Passport">Passport</option>
            <option value="DrivingLicence">Driving License</option>
            <option value="IdentityDocument">Identity Document</option>
          </select>
        </div>
        <div v-if="verifyDocType" class="acc-input-wrap acc-input-wrap--upload">
          <label v-if="verifyDocType === 'DrivingLicence' || verifyDocType === 'IdentityDocument'">Front:</label>
          <input type="file" @change="Images_onFileChanged">
        </div>
        <div v-if="verifyDocType && (verifyDocType === 'DrivingLicence' || verifyDocType === 'IdentityDocument')" class="acc-input-wrap acc-input-wrap--upload">
          <label v-if="verifyDocType === 'DrivingLicence' || verifyDocType === 'IdentityDocument'">Back:</label>
          <input type="file" @change="Images_onFileChanged($event, 'back')">
        </div>
        <div class="acc-inputs-footer">
          <Button variant="outlined-white" text="Cancel" @clicked="step = 1"/>
          <Button variant="rounded-blue" text="Proceed" @clicked="uploadDocuments" :disabled="!verifyDocType" />
        </div>

        <div class="id-help content">
          <p>
            In order to process your withdrawal we need to positively identify you.
            To complete this please upload a clear, legible scan using the tool above of one of the following types of photo identity documents.
          </p>
          <p>
            1. Passport<br>
            2. Driving License<br>
            3. Government Issued Identity Card
          </p>
          <p>
            Please ensure that the details on the document match the details you have already provided to us.
            Once this is uploaded our team will verify your documents, after which you will be able to request a withdrawal.
            We may as part of our process request futher documentation to complete our verification checks.
            If this needed we will email you.
          </p>
          <p>
            If you have any questions please contact us at support@tournament.com, just remember,
            whenever you email us please include your username as it helps us locate your account quicker.
          </p>
        </div>
      </form>
      <div class="form--loading-overlay">
        <div class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
      </div>
    </div>
  </div>
</template>

<script>
// import UserInfo from '@/components/panel/UserInfo.vue';
import Button from '@/components/global/Button.vue';

export default {
  name: 'Address',
  components: {
    // UserInfo,
    Button,
  },
  props: {
    title: String,
    desc: String,
    submitCallback: Function,
    cancel: Function,
    partial: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      step: 1,
      isLoading: false,
      isProcessing: false,
      profileData: [],
      email: '',
      showFeed: false,
      updateProfileObj: {
        // forename: '',
        // surname: '',
        // mobileNumber: '',
        // dob: '',
        address: {
          line1: '',
          line2: '',
          line3: '',
          city: '',
          state: '',
          zipCode: '',
          country: '',
        },
      },
      errors: {
        line1: [],
        city: [],
        zipCode: [],
        country: [],
      },
      verifyRequestID: '',
      verifyDocType: '', // Available values : Passport, DrivingLicence, BankStatement, IdentityDocument
      Images: {
        front: {
          selectedFile: null,
          mime: '',
        },
        back: {
          selectedFile: null,
          mime: '',
        },
      },
      verifyUploadUrl: {
        front: '',
        back: '',
      },
    };
  },
  computed: {
    formIsValid() {
      if (this.partial) {
        return this.updateProfileObj.address.zipCode?.length && this.updateProfileObj.address.country?.length && !Object.values(this.errors).flat().length;
      }
      return this.updateProfileObj.address.line1?.length && this.updateProfileObj.address.city?.length && this.updateProfileObj.address.zipCode?.length
          && this.updateProfileObj.address.country?.length && !Object.values(this.errors).flat().length;
    },
    isMobile() {
      return this.$store.state.helpers.isMobile;
    },
    isMobileSmall() {
      return this.$store.state.helpers.isMobileSmall;
    },
    displayNameStore() {
      if (this.$store.state.auth.userData) {
        return this.$store.state.auth.userData.displayName;
      }
      return '';
    },
    // get all user data
    userData() {
      return this.$store.state.auth.userData;
    },
    // get user avatar
    userAvatar() {
      return this.userData !== null ? this.userData.avatarUrl : '';
    },
    // get user wallet
    wallet() {
      return this.$store.state.banking.wallet;
    },
    // get user wallet balance from wallet
    walletBalance() {
      return this.$store.getters.walletBalance;
    },
  },
  watch: {
    //
  },
  async created() {
    this.isLoading = true;
    try {
      await this.fetchProfile();
    } catch (ex) {
      console.error('inner', ex.message);
      throw ex;
    }
  },
  methods: {
    isValid(fieldName) {
      this.errors[fieldName] = [];
      if (!this.updateProfileObj.address[fieldName].length) {
        this.errors[fieldName].push('This field is required.');
      }
    },
    Images_onFileChanged(event, side = 'front') {
      if (side === 'back') {
        this.Images.back.selectedFile = event.target.files[0]; // eslint-disable-line
        this.Images.back.mime = event.target.files[0].type; // eslint-disable-line
      } else {
        this.Images.front.selectedFile = event.target.files[0]; // eslint-disable-line
        this.Images.front.mime = event.target.files[0].type; // eslint-disable-line
      }
    },
    fetchProfile() {
      this.isLoading = true;
      return this.$api
        .get(`/user/profile`)
        .then((response) => response.data)
        .then((profileData) => {
          console.log(profileData);
          this.profileData = profileData;
          this.email = profileData.email;
          if (profileData.address) {
            this.updateProfileObj.address = { ...profileData.address };
          }
          if (!profileData || !profileData.address || !profileData.address.country) {
            if (this.userData && this.userData.country) {
              this.updateProfileObj.address.country = this.userData.country;
              return true;
            }
            return this.$api.get('http://ip-api.com/json/?fields=status,message,countryCode');
          }
          return true;
        })
        .then(({ data }) => {
          if (data && data.countryCode) {
            this.updateProfileObj.address.country = data.countryCode;
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    cancelAction() {
      if (this.cancel) this.cancel();
      else this.$router.push({ name: 'Profile' });
    },
    updateProfile() {
      this.isProcessing = true;
      // this.$api
      //   .post('/user/verify/validate');
      this.$api
        .put('/user/profile', {
          ...this.updateProfileObj,
        })
        .then(() => this.$store.dispatch('loadUserData'))
        .then(() => {
          if (this.submitCallback) this.submitCallback();
          else this.startVerifyProcess();
        })
        .catch((err) => {
          console.log(err.message || err);
        })
        .finally(() => {
          this.isProcessing = false;
          if (!this.submitCallback) this.step = 2;
        });
    },
    startVerifyProcess() {
      this.isProcessing = true;
      this.$api
        .post('/user/verify')
        .then((response) => {
          this.verifyRequestID = response.data.id;
        })
        .catch((err) => {
          console.log(err.message || err);
        })
        .finally(() => {
          this.isProcessing = false;
        });
    },
    requestUploadUrl(side = 'front') {
      return this.$api
        .post('/user/verify/attachment', null, {
          params: {
            documentType: this.verifyDocType,
            contentType: this.Images[side].mime,
          },
        })
        .then((response) => {
          this.verifyUploadUrl[side] = response.data.url;
        })
        .catch((err) => {
          console.log(err.message || err);
        });
    },
    uploadDocuments() {
      this.isProcessing = true;
      this.requestUploadUrl()
        .then(() => {
          this.$http
            .put(this.verifyUploadUrl.front, this.Images.front.selectedFile, {
              headers: {
                'Content-Type': this.Images.front.mime,
              },
            })
            .then(() => {
              if (this.verifyDocType === 'DrivingLicence' || this.verifyDocType === 'IdentityDocument') {
                this.uploadDocumentBack();
              } else {
                this.validateVerifyProcess();
              }
            })
            .catch((err) => {
              console.log(err.message || err);
            })
            .finally(() => {
              this.isProcessing = false;
            });
        });
    },
    uploadDocumentBack() {
      this.isProcessing = true;
      this.requestUploadUrl('back')
        .then(() => {
          this.$http
            .put(this.verifyUploadUrl.back, this.Images.back.selectedFile, {
              headers: {
                'Content-Type': this.Images.back.mime,
              },
            })
            .then(() => {
              this.validateVerifyProcess();
            })
            .catch((err) => {
              console.log(err.message || err);
            })
            .finally(() => {
              this.isProcessing = false;
            });
        });
    },
    validateVerifyProcess() {
      this.isProcessing = true;
      this.$api
        .post('/user/verify/validate')
        .then((response) => {
          if (response.status === 204) {
            this.$store.dispatch('loadUserData');
            this.$router.push({ name: 'Profile' });
          }
        })
        .catch((err) => {
          console.log(err.message || err);
        })
        .finally(() => {
          this.isProcessing = false;
        });
    },
  },
};
</script>

<style scoped lang="scss">
.form--loading-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: calc(100% + 2rem);
  height: calc(100% + 2rem);
  background-color: rgba(16, 16, 24, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}
.t-form:not(.is-loading) {
  &+.form--loading-overlay {
    display: none;
  }
}
.t-form:not(.is-loading) {
  &+.form--loading-overlay {
    display: none;
  }
}
.profile__main-body {
  height: 100%;
  padding: 2rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  color: #fff;
  &.embed {
    padding-top: 1rem;
    & .acc-info {
      padding: 1rem 2rem;
      margin-top: 0;
    }
    @media (max-width: 768px) {
      & .acc-info {
        margin-bottom: 0 !important;
        padding: 10px;
        & .acc-info__desc {
          margin-top: 0.5rem;
          margin-bottom: 1.5rem;
          font-size: 14px;
        }
        & .acc-inputs {
          margin-bottom: 0;
        }
      }
    }
  }
}
.profile__footer {
  margin-top: auto;
}
.input-edit {
  width: 30px;
}
.acc-info {
  width: 500px;
  max-width: 100%;
  margin: 2rem auto 0 auto;
  text-align: center;
  position: relative;
}
.acc-info__title {
  margin: 0;
  font-weight: 700;
  font-size: 20px;
}
.acc-info__desc {
  color: $kimberly;
  margin-bottom: 2rem;
}
.acc-inputs {
  margin: 1rem 0;
  position: relative;
}
.acc-input-wrap__inner {
  position: relative;
}
ul.errors {
  margin-bottom: 1rem;
  margin-top: 0.5rem;
  & li {
    text-align: left;
  }
}
.acc-input {
  font-size: 12px;
  font-weight: 500;
  padding: 1rem;
  width: 100%;
  background-color: $light-navy;
  color: $kimberly;
  border-radius: 0 !important;
  border: 0;
  outline: none;

  &:-webkit-autofill{
    -webkit-text-fill-color: yellow !important;
  }

  &.error {
    border: 1px solid $red;
  }

  &:not([readonly]) {
    color: #fff;
  }
  &[disabled] {
    opacity: 1 !important;
    -webkit-text-fill-color: $kimberly;
  }
  option {
    padding: 0;
  }
}
.acc-input--editable {
  padding-right: 4rem;
}
.acc-input-wrap {
  font-size: 12px;
  &:not(:last-child) {
    margin-bottom: 1rem;
  }
}
.input-edit {
  position: absolute;
  width: 20px;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  cursor: pointer;
}
.ldr {
  background-color: $light-navy;
  &::after {
    animation-name: loader500;
    background: linear-gradient(to right, rgba(29,29,48,1) 8%,rgba(35,35,56,1) 18%,rgba(29,29,48,1) 33%);
  }
}

.acc-inputs-footer>.button {
  margin: 0 .5rem;
}
.acc-inputs-footer>.button--blue {
  padding-left: 2rem;
  padding-right: 2rem;
}
select.acc-input.acc-input--editable.is-placeholder {
  color: #717172;
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
  color: $kimberly;
}
.acc-input-wrap--hasselect {
  position: relative;
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
.acc-input-wrap--upload {
  text-align: left;
  background-color: $light-navy;
  padding: 1rem;
  label {
    font-weight: 600;
    margin-right: 1rem;
  }
}
.id-help {
  font-size: 12px;
  color: #7474AD;
  line-height: 1.5;
  margin-top: 2.5rem;
}

@media (max-width: 1279px) {
  .panel {
    display: flex;
    flex-direction: column;
  }
  .col-left {
    display: none;
  }
  .mobile-nav {
    order: 1;
  }
  .col-middle {
    order: 3;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .col-right {
    order: 2;
  }
  .profile__main-body {
    width: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
  }
}
@media (max-width: 767px) {
  /deep/ .winner__timeago {
    display: none;
  }
  .acc-info {
    margin-bottom: 4rem !important;
  }
  .acc-input-wrap--upload {
    label {
      display: block;
      margin: 0 0 .5rem 0;
    }
  }
}
</style>
