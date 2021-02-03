(function() {
  if (typeof window.CustomEvent === "function") return false; //If not IE

  function CustomEvent(event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent("CustomEvent");
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();

var symbols = [
    "ABBV",
    "TAP",
    "WEED.TO",
    "TLRY",
    "CGC",
    "ACB.TO",
    "ACBFF",
    "APG",
    "RFW",
    "GEMC",
    "AXRFW",
    "ASCW",
    "ACOEG"
  ],
  companies = ["Company 1", "Company 2", "Company 3", "Company 4", "Company 5", "Company 6", "Company 7", "Company 8"],
  tBodyEl,
  _dateToday = moment().format("DD/MM/YYYY"),
  cryptoCurrencyList = ["EOS/ETH", "LTC/EOS", "ETH/LTC", "BTC/ETH", "XLM/BTC"],
  translations;

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function generateRandom() {
  var rSymbol = getRandomInt(symbols.length - 1);
  var rCompany = getRandomInt(companies.length - 1);
  var rValue = getRandomInt(1000);
  var rValue2 = getRandomInt(500);
  var rValue3 = getRandomInt(100);
  var isNegative = rValue % 2 === 0 ? "red_alert" : "";

  return (
    '<tr><td class="data_symbol text-style-31">' +
    symbols[rSymbol] +
    '</td><td class="data_company text-style-32">' +
    companies[rCompany] +
    '</td><td class="data_lastPrice text-style-29">' +
    rValue +
    '</td><td class="data_change text-style-33 ' +
    isNegative +
    ' ">65d</td><td class="data_change_perc text-style-33">' +
    rValue3 +
    '</td><td class="data_marketTime text-style-32">9sd875</td>' +
    '<td class="data_volume text-style-32">4545</td>' +
    '<td class="data_marketCap text-style-32">' +
    rValue2 +
    "</td></tr>"
  );
}

function startIntervalForTrade() {
  setInterval(function() {
    tBodyEl.prepend(generateRandom());
    jQuery(tBodyEl.children()[9]).remove();
  }, 3000);
}

function setupTableContent() {
  for (var i = 0; i < 10; i++) {
    tBodyEl.append(generateRandom());
  }
  setTimeout(startIntervalForTrade, 3000);
}

function setupHeaderWarning() {
  $(".todayDate").html(_dateToday);

  var eventTime = moment()
    .add(6, "minutes")
    .add(38, "seconds");
  var currentTime = moment();
  var diffTime = eventTime.diff(currentTime);
  var duration = moment.duration(diffTime, "milliseconds");
  var interval = 100;

  var _counterInterval = setInterval(function() {
    duration = moment.duration(duration - interval, "milliseconds");
    if (duration > 0) {
      var _sec = duration.seconds().toString().length == 2 ? duration.seconds() : "0" + duration.seconds();
      $(".runningOutTime").text(
        "0" +
          duration.minutes() +
          ":" +
          _sec +
          "." +
          duration
            .milliseconds()
            .toString()
            .slice(0, 1)
      );
    } else {
      $(".runningOutTime").text("00:00.0");
      clearInterval(_counterInterval);
      _counterInterval = null;
    }
  }, interval);
}

function startLoadingModal() {
  $("#loadingModal")
    .addClass("show")
    .css("display", "block");
  $("body").addClass("modal-open");

  var _percentCount = 0;
  var _intervalGen = setInterval(function() {
    _percentCount++;
    if (_percentCount < 100) {
      $(".loader-number").html(_percentCount + "%");
    } else {
      $("#loadingModal")
        .removeClass("show")
        .css("display", "none");
      $("#congratulations")
        .addClass("show")
        .css("display", "block");
      clearInterval(_intervalGen);
      _intervalGen = 0;
    }
  }, 15);
}

function setupFormFlow() {
  var _activeStep = 0;
  var _formModel = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: ""
  };

  $(".form_submit_btn").click(function(e) {
    e.preventDefault();
    _activeStep++;
    var _currentFormLeftOffset =
      ($(".form-trade-now").outerWidth() - $(".form-trade-now > .row:first-child").outerWidth()) / 2 + "px";
    var _widthParent = $(".form_box").width() + "px";
    var _marginLeftToHide = "-" + _widthParent;
    switch (_activeStep) {
      case 1:
        $("#first-form")
          .width(_widthParent)
          .animate({ marginLeft: _marginLeftToHide }, "fast", function() {
            $(this).hide();
            $("#second-form")
              .show()
              .animate({ marginLeft: _currentFormLeftOffset }, "fast");
          });
        $(".first-form-step").removeClass("active_span");

        $(".second-form-step").addClass("active_span");
        break;
      case 2:
        $("#second-form")
          .width(_widthParent)
          .animate({ marginLeft: _marginLeftToHide }, "fast", function() {
            $(this).hide();
            $("#third-form")
              .show()
              .animate({ marginLeft: _currentFormLeftOffset }, "fast");
          });
        $(".second-form-step").removeClass("active_span");
        $(".third-form-step").addClass("active_span");
        break;
      case 3:
        startLoadingModal();
        break;
      default:
        $("#first-form").show();
        $(".first-form-step").addClass("active_span");
        $("#second-form").hide();
        $("#third-form").hide();
    }
  });
}
document.addEventListener("visitorLocated", function(e) {
  $('[data-init="country-flag"]').each(function() {
    var obj = $(this);
    // var imgurl = "img/flags/" + ipdata.isoCode.toUpperCase() + ".png";
    var imgurl = "img/rs_flag.jpg";
    obj.attr("src", imgurl);
  });

  var region = ipdata.country;
  var url = "api/uinames.php?";

  $.ajax({
    type: "get",
    url: url + "&region=" + region,
    success: function(response) {
      $("#exampleNames").removeClass("hidden");
      loopPeople(response);
      populatePeopleInTable(response);
    },
    error: function(response) {
      region = "England";
      $.ajax({
        type: "get",
        url: url + "&region=" + region,
        success: function(response) {
          $("#exampleNames").removeClass("hidden");
          loopPeople(response);
        }
      });
    }
  });
});

document.addEventListener("translationsApplied", function(e) {
  $('[data-i18n="country-name-custom"]').each(function() {
    var obj = $(this);

    if (typeof translations["country-name-custom"] == "undefined") {
      var cc = ipdata.country;
    } else {
      var cc = translations["country-name-custom"];
    }

    if (typeof countryColors[ipdata.isoCode.toUpperCase()] != "undefined") {
      words = cc.split(/ (.+)/);
      if (words.length < 2) {
        words[0] = cc.substring(0, cc.length / 2);
        words[1] = cc.substring(cc.length / 2);
      } else {
        words[0] += " ";
      }
      var word = $("<span/>")
        .css("color", countryColors[ipdata.isoCode.toUpperCase()][0])
        .text(words[0].toUpperCase())[0].outerHTML;
      word += $("<span/>")
        .css("color", countryColors[ipdata.isoCode.toUpperCase()][1])
        .text(words[1].toUpperCase())[0].outerHTML;
      obj.html(word);
    }
  });
});

var applyTranslations = function() {
  $("[data-i18n]").each(function() {
    var key = $(this).attr("data-i18n");
    if (typeof translations[key] !== "undefined") {
      switch ($(this).prop("tagName")) {
        case "INPUT":
          $(this).attr("placeholder", translations[key]);
          break;
        default:
          $(this).text(translations[key]);
      }
    }
  });
  var d = new CustomEvent("translationsApplied", { detail: translations });
  document.dispatchEvent(d);
};

$(document).ready(function() {
  setupHeaderWarning();
  tBodyEl = $("tbody");
  setupTableContent();
  setupFormFlow();

  ipdata.isoCode = ipdata.country_code.toLowerCase();

  $("#phoneNumber").intlTelInput({
    autoHideDialCode: true,
    autoPlaceholder: "polite",
    initialCountry: ipdata.isoCode,
    nationalMode: true,
    separateDialCode: false,
    utilsScript: "js/intl-tel-input-12.3.0/js/utils.js"
  });

  $("body")
    .find(".move-to-top")
    .each(function() {
      $(this).click(function() {
        var _offsetTop = 0;
        if ($("html,body").width() < 768) {
          _offsetTop = 180;
        } else {
          _offsetTop = $(".video-form-container").offset().top - 20;
        }
        $("html,body")
          .stop()
          .animate(
            {
              scrollTop: _offsetTop
            },
            "fast"
          );
      });
    });

  var n = new CustomEvent("visitorLocated", { detail: ipdata });
  document.dispatchEvent(n);

  $.ajax({
    // url: "/api/i18n/" + ipdata.isoCode + ".json",
    url: "en.json",
    type: "get",
    success: function(e) {
      translations = e;

      var t = new CustomEvent("translationsLoaded", { detail: e });
      document.dispatchEvent(t);

      applyTranslations();
    },
    error: function(e) {
      translations = e;

      var t = new CustomEvent("translationsLoaded", { detail: e });
      document.dispatchEvent(t);

      applyTranslations();
    },
    complete: function() {}
  });
});
