import { Extrapolate, interpolate } from "react-native-reanimated";
import { DAY_IN_MILISECONDS, SCREEN_HEIGHT, SCREEN_WIDTH } from "./constants";
import {
  AccountGlobalParams,
  AccountResponse,
  EffectPlaceHolder,
  PostGlobalParams,
  PostResponse,
  Property,
  TransitionParams,
  TransitionProperty,
} from "./types";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "Aug",
  "September",
  "October",
  "November",
  "December",
];

export function getDate(timestamp: number) {
  const currentDate = new Date();
  const targetDate = new Date(timestamp);

  if (
    currentDate.getDate() === targetDate.getDate() &&
    currentDate.getTime() - timestamp < DAY_IN_MILISECONDS
  ) {
    return "Today";
  } else if (
    currentDate.getDate() === targetDate.getDate() + 1 &&
    currentDate.getTime() - timestamp < 2 * DAY_IN_MILISECONDS
  ) {
    return "Yestarday";
  } else {
    return (
      `${MONTHS[targetDate.getMonth()]} ${targetDate.getDate() + 1}` +
      (targetDate.getFullYear() < currentDate.getFullYear()
        ? " " + targetDate.getFullYear()
        : "")
    );
  }
}

export function generateTimestampString(timestamp: number) {
  const miliseconds = timestamp % 1000;
  const totalSeconds = Math.floor(timestamp / 1000);
  const seconds = totalSeconds % 60;
  const totalMins = Math.floor(totalSeconds / 60);
  const mins = totalMins % 60;
  const hours = Math.floor(totalMins / 60);

  return `${hours > 9 ? "" + hours : "0" + hours}:${
    mins > 9 ? "" + mins : "0" + mins
  }:${seconds > 9 ? "" + seconds : "0" + seconds}:${
    miliseconds > 99
      ? "" + miliseconds
      : miliseconds > 9
      ? "0" + miliseconds
      : "00" + miliseconds
  }`;
}

export function getDurationString(
  timstamp: number,
  includeMillis?: boolean,
  fullFormat?: boolean
) {
  const totalHours = Math.floor(timstamp / 3600_000);
  const remainderMins = timstamp % 3600_000;
  const totalMins = Math.floor(remainderMins / 60_000);
  const remainderSecs = remainderMins % 60_000;
  const totalSeconds = Math.floor(remainderSecs / 1000);
  const remainderMillis = remainderSecs % 1000;

  const millisString = includeMillis
    ? "." +
      (remainderMillis <= 9
        ? "00" + remainderMillis
        : remainderMillis <= 99
        ? "0" + remainderMillis
        : remainderMillis + "")
    : "";

  const secString = totalSeconds <= 9 ? "0" + totalSeconds : totalSeconds + "";

  const minString =
    totalMins <= 9 && (fullFormat || totalHours > 0)
      ? "0" + totalMins + ":"
      : totalMins + ":";

  const hourString = fullFormat
    ? totalHours <= 9
      ? "0" + totalHours + ":"
      : totalHours + ":"
    : totalHours === 0
    ? ""
    : totalHours <= 9
    ? "0" + totalHours + ":"
    : totalHours + ":";

  return hourString + minString + secString + millisString;
}

export function getTimeElapsedString(timestamp: number) {
  const currentTime = new Date();

  const targetTime = new Date(timestamp);

  const currentYear = currentTime.getFullYear();
  const targetYear = targetTime.getFullYear();

  if (currentYear > targetYear) {
    const noOfYears = currentYear - targetYear;
    return noOfYears === 1 ? "1 year ago" : noOfYears + " years ago";
  } else {
    const currentMonth = currentTime.getMonth();
    const targetMonth = targetTime.getMonth();

    if (currentMonth > targetMonth) {
      const noOfMonths = currentMonth - targetMonth;
      return noOfMonths === 1 ? "1 month ago" : noOfMonths + " months ago";
    } else {
      const currentDay = currentTime.getDate();
      const targetDay = targetTime.getDate();

      if (currentDay > targetDay) {
        const noOfDays = currentDay - targetDay;
        if (noOfDays < 7) {
          return noOfDays === 1 ? "1 day ago" : noOfDays + " days ago";
        } else {
          const noOfWeeks = Math.floor(noOfDays / 7);
          return noOfWeeks === 1 ? "1 week ago" : noOfWeeks + " weeks ago";
        }
      } else {
        const currentHour = currentTime.getHours();
        const targetHour = targetTime.getHours();
        if (currentHour > targetHour) {
          const noOfHours = currentHour - targetHour;
          return noOfHours ? "1 hour ago" : noOfHours + " hours ago";
        } else {
          const currentMins = currentTime.getMinutes();
          const targetMins = targetTime.getMinutes();
          if (currentMins > targetMins) {
            const noOfMins = currentMins - targetMins;
            return noOfMins ? "1 min ago" : noOfMins + " mins ago";
          } else {
            return "just now";
          }
        }
      }
    }
  }
}

export function getCountString(count: number) {
  if (count < 1000) {
    return count + "";
  } else if (count < 1_000_000) {
    return Math.floor(count / 1000) + "K";
  } else if (count < 1_000_000_000) {
    return Math.floor(count / 1_000_000) + "M";
  } else {
    return Math.floor(count / 1_000_000_000) + "B";
  }
}

export function getTextSections(text: string) {
  const pattern = /(#([A-z]|[0-9]|_)+|@([A-z]|_)([A-z]|[0-9]|_)*)/m;
  let sections: string[] = [];

  while (text && text.length > 0) {
    //first look for the hashtag or mentions in the target string;
    const result = pattern.exec(text);
    let highlightedPhase = "";
    if (result) {
      highlightedPhase = result[0];
    }

    //find the index of both the phases
    let highlightedPhaseSearchIndex =
      highlightedPhase === "" ? 20000 : text.indexOf(highlightedPhase);

    //append the phase before the target phase and the phase itself to the section list;
    if (highlightedPhaseSearchIndex === 20000) {
      sections.push(text);
      break;
    }

    if (highlightedPhaseSearchIndex > 0) {
      sections.push(text.substring(0, highlightedPhaseSearchIndex));
    }
    sections.push(
      text.substring(
        highlightedPhaseSearchIndex,
        highlightedPhase.length + highlightedPhaseSearchIndex
      )
    );

    //cut the main string at the end of target phase
    text = text.substring(
      highlightedPhase.length + highlightedPhaseSearchIndex
    );
  }

  return sections;
}

export async function delay(millis: number): Promise<unknown> {
  return new Promise((resolve) => setTimeout(resolve, millis));
}

export function convertAccounts(
  accounts: AccountResponse[]
): AccountGlobalParams[] {
  return accounts.map((account) => ({
    ...account,
    stories: [],
  }));
}

export function extractAccountsFromPosts(
  posts: PostResponse[]
): AccountGlobalParams[] {
  const accounts: AccountResponse[] = [];
  posts.forEach((post) => {
    accounts.push(post.author);
    accounts.push(...post.accounts);
  });

  return convertAccounts(accounts);
}

export function convertPosts(posts: PostResponse[]): PostGlobalParams[] {
  return posts.map((post) => ({
    ...post,
    author: post.author.userid,
    accounts: post.accounts.map((account) => account.userid),
  }));
}
