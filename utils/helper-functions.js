export function renderImage(category) {
  switch (category) {
    case "Purple category":
      return "https://heal-community-portal-api.s3.amazonaws.com/webinar_img_8b5d53f130.png";
    default:
      return "https://heal-community-portal-api.s3.amazonaws.com/webinar_img_8b5d53f130.png";
  }
}

export function filterByDate(arr) {
  let newArr = arr.sort(function (a, b) {
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    return new Date(b.start.dateTime) - new Date(a.start.dateTime);
  });

  return newArr;
}

export function makeEasternTime(GMT) {
  switch (GMT) {
    case "11:00:00 AM":
      return "6:00 AM";
    case "11:30:00 AM":
      return "6:30 AM";
    case "12:00:00 PM":
      return "7:00 AM";
    case "12:30:00 PM":
      return "7:30 AM";
    case "1:00:00 PM":
      return "8:00 AM";
    case "1:30:00 PM":
      return "8:30 AM";
    case "2:00:00 PM":
      return "9:00 AM";
    case "2:30:00 PM":
      return "9:30 AM";
    case "3:00:00 PM":
      return "10:00 AM";
    case "3:30:00 PM":
      return "10:30 AM";
    case "4:00:00 PM":
      return "11:00 AM";
    case "4:30:00 PM":
      return "11:30 AM";
    case "5:00:00 PM":
      return "12:00 PM";
    case "5:30:00 PM":
      return "12:30 PM";
    case "6:00:00 PM":
      return "1:00 PM";
    case "6:30:00 PM":
      return "1:30 PM";
    case "7:00:00 PM":
      return "2:00 PM";
    case "8:30:400 PM":
      return "2:30 PM";
    case "8:00:00 PM":
      return "3:00 PM";
    case "8:30:400 PM":
      return "3:30 PM";
    case "9:00:00 PM":
      return "4:00 PM";
    case "9:30:00 PM":
      return "4:30 PM";
    case "10:00:00 PM":
      return "5:00 PM";
    default:
      return " ";
  }
}

export function makeEasternTimeWithDaylightSavings(GMT) {
  switch (GMT) {
    case "11:00:00 AM":
      return "7:00 AM";
    case "11:30:00 AM":
      return "7:30 AM";
    case "12:00:00 PM":
      return "8:00 AM";
    case "12:30:00 PM":
      return "8:30 AM";
    case "1:00:00 PM":
      return "9:00 AM";
    case "1:30:00 PM":
      return "9:30 AM";
    case "2:00:00 PM":
      return "10:00 AM";
    case "2:30:00 PM":
      return "10:30 AM";
    case "3:00:00 PM":
      return "11:00 AM";
    case "3:30:00 PM":
      return "11:30 AM";
    case "4:00:00 PM":
      return "12:00 AM";
    case "4:30:00 PM":
      return "12:30 AM";
    case "5:00:00 PM":
      return "1:00 PM";
    case "5:30:00 PM":
      return "1:30 PM";
    case "6:00:00 PM":
      return "2:00 PM";
    case "6:30:00 PM":
      return "2:30 PM";
    case "7:00:00 PM":
      return "3:00 PM";
    case "7:30:00 PM":
      return "3:30 PM";
    case "8:00:00 PM":
      return "4:00 PM";
    case "8:30:400 PM":
      return "4:30 PM";
    case "9:00:00 PM":
      return "5:00 PM";
    case "9:30:00 PM":
      return "5:30 PM";
    case "10:00:00 PM":
      return "6:00 PM";
    default:
      return " ";
  }
}

export function checkDaylightSavings(date) {
  Date.prototype.stdTimezoneOffset = function () {
    var jan = new Date(this.getFullYear(), 0, 1);
    var jul = new Date(this.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
  };

  Date.prototype.isDstObserved = function () {
    return this.getTimezoneOffset() < this.stdTimezoneOffset();
  };

  if (date.isDstObserved()) {
    return true;
  } else {
    return false;
  }
}
