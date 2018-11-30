function getWebFormId(fieldName) {
  return "web_form_" + fieldName;
}

function initializePads() {
  let webFormCanvases = document.getElementsByClassName('web-form-canvas');
  Array.from(webFormCanvases).forEach((c) => {
    var signaturePad = new SignaturePad(c, {
        minWidth: .01,
        maxWidth: .8,
        penColor: penColor,
        onEnd: function() {
          markAsValid(c, (!c.pad.isEmpty()));
        }
    });
    let clearBtn = document.querySelector("input[data-target='" + c.id + "']");
    c.pad = signaturePad;
    clearBtn.pad = signaturePad;
    clearBtn.onclick = () => {
      clearBtn.pad.clear();
    }
  });
}

function buildInput(f, fId, index) {
  let input = null;
  if (f.type === "input") {
    let tabindex = index;
    if (f.part === 'emailProvider') {
      tabindex += 1;
    } else if (f.part === 'emailUsername') {
      tabindex -= 1;
    }
    input = '<input type="text" class="form-control" id="' + fId + '" placeholder="" tabindex="' + tabindex + '">';
      //<small id="emailHelp" class="form-text text-muted">הערה לגבי השדה הנ״ל</small>
  } else if (f.type === "signature") {
    let style = "border:1px dashed #cccccc; background: url('register-to-likud.png'); background-size: 1140px 2052.34px; background-position: -" + f.x + "px -" + f.y + "px";
    input =  `<canvas class="field-form web-form-canvas" id="` + fId + `" width="` + f.width + `" height="` + f.size + `" style="` + style + `"></canvas>`;
    input += '<input type="button" class="btn btn-warning btn-sm" value="X" data-target="' + fId + '"/>';
  }
  return input;
}

function getMonthsList() {
  let monthsArray = ['', 'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
  let html = '';
  html = '<option value="-1">חודש</option>';
  for (let i=1; i < monthsArray.length; i++) {
      html += '<option value="' + i + '">' + monthsArray[i] + '</option>';
  }
  return html;
}

function getOptionList(start, end, reversed, label, displayArray) {
  let html = '';
  if (label) {
    html = '<option value="-1">' + label + '</option>';
  }

  if (reversed) {
    for (let i=end; i >= start; i--) {
      html += '<option value="' + i + '">' +  i  + '</option>';
    }
  } else {
  for (let i=start; i <= end; i++) {
    html += '<option value="' + i + '">' + i + '</option>';
  }
  }

  return html;
}

function buildFormRow(f, index) {
  let fId = getWebFormId(f.name);
  let input = null;

  if (f.partOfDate) {
    let parts = f.name.split("_");
    let datePart = parts[parts.length - 1];

    if (datePart === "year") {

     return `<div class="form-group row ` + (f.doubleFormOnly?"double-form-only ":"") + ' ' + (f.nonLikudField?"nonLikudField ":"") +' ' + (f.likudOnly?"likud-only":"") +`">
        <label for="` + fId + `" class="col-xs-11 col-form-label">` + f.heb + (f.allowEmpty?"":" <font color=red>*</font>") + `</label>
        <div class="col-xs-3 align-right">
          <select class="form-control" style="min-width: 65;"` + (f.likudOnly?"likud-only":"") + ` id="web-form-day">` + getOptionList(1, 31, false, 'יום') + `</select>
        </div>
        <div class="col-xs-4 align-right">
          <select class="form-control" ` + (f.likudOnly?"likud-only":"") + `  id="web-form-month">` + getMonthsList() + `</select>
        </div>
        <div class="col-xs-4 align-right">
          <select class="form-control" ` + (f.likudOnly?"likud-only":"") + ` id="web-form-year">` + getOptionList(1900, YEAR_INT - 17, true, 'שנה') + `</select>
        </div>
        <div class="help-block">נא להזין ` + f.heb + `</div>
      </div>`;

    } else {
      return '';
    }
  } else {
    input = buildInput(f, fId, index);
  }

  if (f.part === 'emailProvider') {
    return `<div class="form-group row ` + (f.doubleFormOnly?"double-form-only":"") + `">
    <label for="` + fId + `" class="col-xs-11 col-sm-3 col-form-label">` + f.heb + (f.allowEmpty?"":" <font color=red>*</font>") + `</label>
        <div class="col-xs-11 col-sm-8">
          <div class="input-group">
            ` + input + `
            <span class="input-group-addon" id="basic-addon1">@</span>`;
  }
  if (f.part === 'emailUsername') {
    return input + `
          </div>
          <span class="help-block">נא להזין ` + f.heb + `</span>
        </div>
      </div>`;
  }

  if (f.name == 'credit_date') {
    return `<div class="form-group row ` + (f.doubleFormOnly?"double-form-only":"") +' ' + (f.likudOnly?"likud-only":"") + `">
        <label for="` + fId + `" class="col-xs-3 col-form-label">` + f.heb + (f.allowEmpty?"":" <font color=red>*</font>") + `</label>
        <div class="col-xs-4 align-middle">
          <select class="form-control" id="credit_date_year">
            ` + getOptionList(YEAR_INT, YEAR_INT + 10) + `
          </select>
          <span class="help-block">נא להזין ` + f.heb + `</span>
        </div>
        <div class="col-xs-4 align-middle">
          <select class="form-control" id="credit_date_month">
            ` + getOptionList(1, 12) + `
          </select>
          <span class="help-block">נא להזין ` + f.heb + `</span>
        </div>
      </div>`;
  }

  return `<div class="form-group row ` + (f.doubleFormOnly?"double-form-only ":"") + ' ' + (f.nonLikudField?"nonLikudField ":"") +' ' + (f.likudOnly?"likud-only":"") +`">
        <label for="` + fId + `" class="col-xs-6 col-form-label">` + f.heb + (f.allowEmpty?"":" <font color=red>*</font>") + `</label>
        <div class="col-xs-11 align-right">
          ` + input + `
          <span class="help-block">נא להזין ` + f.heb + `</span>
        </div>
      </div>`;
}

function initializeDoubleFormRadio() {
  const radioArr = Array.from(document.getElementsByName('double-form-radio'));
  radioArr.forEach((radio) => {
    radio.onclick = () => {
      hideDoubleForm = radioArr[0].checked;
      showOrHideFields();
    }
  });
}

function initializePakudCheckBox() {
  const checkBox = document.getElementById('no-likud-fields');

  checkBox.onchange = () => {
      hideLikud =checkBox.checked;
      showOrHideFields();
    };
}

function initTestsMode() {
  document.ondblclick =  () => {
    hideNonLikud = false;
    showOrHideFields();
    document.getElementById('noLikudCheckLabel').style.display = "block";
  }
}



function showOrHideFields() {
  Array.from(document.querySelectorAll(".nonLikudField")).forEach((c) => {
    c.style.display = shouldHide( c.classList) ? "none": "block";
  });

  Array.from(document.querySelectorAll(".likud-only")).forEach((c) => {
    c.style.display = shouldHide( c.classList) ? "none" : "block";
  });

  Array.from(document.querySelectorAll(".double-form-only")).forEach((c) => {
    c.style.display =shouldHide(c.classList)? "none" : "block";
  });
}

function shouldHide(classList) {
 return(classList.contains("likud-only") && hideLikud)
  || (classList.contains("nonLikudField") && hideNonLikud)
  || (classList.contains("double-form-only") && hideDoubleForm);

}


function isEmpty(field, element) {
   if (field.partOfDate){
        return false;
   }
  if (field.type === 'input') {
    return (!element.value);
  } else if (field.type === 'signature') {
    return (element.pad.isEmpty());
  }
  return true;
}


function initDisclamer(){
  const checkboxLikud = document.getElementById("disclamerLikud");
  const checkboxAgenda = document.getElementById("disclamerAgenda");
  checkboxLikud.addEventListener('change', (event) => {
    likudChecked = event.target.checked;

      if (likudChecked && (hideNonLikud || document.getElementById("disclamerAgenda").checked)) {
        enableSaveButton();
      } else {
        disableSaveButton()
      }

  });

  checkboxAgenda.addEventListener('change', (event) => {
    agendaChecked = event.target.checked;
    if (!hideNonLikud) {
      if (agendaChecked && document.getElementById("disclamerLikud").checked) {
        enableSaveButton();
      } else {
        disableSaveButton();
      }
    }
  });


}

function disableSaveButton(){
  $('#save-button').addClass('disabled');
  $('#save-button').prop('disabled', true);
}

function enableSaveButton() {
  $('#save-button').removeClass('disabled');
  $('#save-button').prop('disabled', false);
}

function buildWebForm() {
  let html = '<font color=red>*</font>שדות חובה';
  fields.forEach((field, index) => {
    if (field.hasOwnProperty('autoField')) {
      return;
    }
    if (field.title) {
      html += '<h2 class="' + (field.doubleFormOnly?"double-form-only":"") +' ' + (field.likudOnly?"likud-only":"") + '">' + field.title + '</h2>';
    }
    html += buildFormRow(field, index);
  });
  html += ``;
  html += `<div class="form-group row"><div class="col-xs-12">
  <label class="checkbox-inline">
            <input type="checkbox" id="disclamerLikud" class="required">
            אני החתום/ה מטה מבקש/ת להצטרף ולהיות חבר/ה בליכוד, תנועת לאומית ליברלית.<br/>
אני מצהיר בזה כדלקמן: אני מזדהה עם מטרותיה של תנועת הליכוד, איני חבר/ה במפלגה אחרת, ולא הורשעתי בעבירה שיש עימה קלון.  ידוע לי, כי דמי החבר הינם שנתיים וכי תשלומם יעשה אחת לשנה באמצעות הוראת קבע בהרשאה לחיוב חשבוני בבנק או כרטיס אשראי שלי וכי לא תישלח לי הודעה מיוחדת לפני החיוב. ידוע לי כי דמי החבר השנתיים הינם סך של 64 ש"ח ליחיד וסך של 96 ש"ח לזוג וכן כי שיעור דמי החבר השנתיים יקבע מעת לעת, בהתאם להוראות חוקת תנועת הליכוד. אני מסכים/ה לקבל מהליכוד הודעת דואר אלקטרוני ו/או הודעת מסר קצר. כמו כן אני מרשה לתנועת הליכוד להעביר לחברי התנועה את שמי ואת הפרטים שלי לצורך יצירת קשר, לרבות את כתובת הדואר האלקטרוני שלי.<br/>
        </label> 
</div></div>`;

    html+= `<div class="form-group row nonLikudField"><div class="col-xs-12">
             <label class="checkbox-inline">
                       <input type="checkbox" id="disclamerAgenda" class="required">
                       <span>קראתי/קראנו את</span>
                       <span> <a href='https://www.newlikud.org/agenda' target="_blank">מסמך העקרונות</a></span>
                       <span>של הליכודניקים החדשים ואני/אנחנו מסכימ/ים איתם.</span>
                   </label>


           </div></div>`;


  html += `<div class="form-group row"><div class="col-xs-8">
    <button type="button" class="btn btn-default navbar-btn btn-primary disabled" id="save-button" disabled>שלח</button>
  </div></div>`;
  document.getElementById("web-form").innerHTML = html;


  initializePads();
  initializeDoubleFormRadio();
  initializePakudCheckBox();
  initializeValidation();
  showOrHideFields();
  initTestsMode();
  initDisclamer();

}

function fillCanvasForm() {
  fields.forEach((f) => {

      let wfID = getWebFormId(f.name);
      const isSingleForm = !document.getElementsByName('double-form-radio')[1].checked;
      console.log(wfID, f.name);
      if (f.nonLikudField){
        f.field.value = document.getElementById(wfID).value;
      } else if (f.autoField) {
        document.getElementById(f.name).value = f.autoField;
      } else if (f.partOfDate) {
        let parts = f.name.split("_");
        let datePart = parts[parts.length - 1];
        let date = $('#web-form-' + f.partOfDate).datepicker('getDate');
        if (f.doubleFormOnly && isSingleForm){ // clear date picker defaults
          document.getElementById(f.name).value = "";
        } else {
          if (datePart === 'day') {
            document.getElementById(f.name).value = document.getElementById('web-form-day').value;
          } else if (datePart === 'month') {
            document.getElementById(f.name).value = document.getElementById('web-form-month').value;
          } else if (datePart === 'year') {
            document.getElementById(f.name).value = document.getElementById('web-form-year').value.toString().substr(-2);;
          }
        }
      } else if (f.name == 'credit_date') {
        document.getElementById(f.name).value =
          document.getElementById('credit_date_month').value +
          document.getElementById('credit_date_year').value.substring(2, 4);
      } else if (f.type === "input") {
        document.getElementById(f.name).value = document.getElementById(wfID).value;
      } else if (f.type === "signature") {
        document.getElementById(f.name).getContext('2d').drawImage(document.getElementById(wfID), 0, 0);
      }
  });
}

function cursorFocus(elem) {
  var x = window.scrollX, y = window.scrollY;
  window.scrollTo(x, y);
  elem.focus();
}
