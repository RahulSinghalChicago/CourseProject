# CourseProject

## Presentation
[Presentation video](https://us02web.zoom.us/rec/play/9zcn6ECFvSSa93p052lSheSXZIPbihVuO43Whj1hhvZqHcbRnIGox_EKeM1XSLR0VXGytStPAyR3B4T0.D7_wByk7ZgV-1sYk)

Please see the PDF of presentation above

## Install

[Chrome Store Extension v1.1](https://chrome.google.com/webstore/detail/hn-jobs/coalohjehpmkdkoanegjcpmihlnhnbjl?hl=en&authuser=0)

## Project Documentation
Please see the PDF file above

## Testing

To test the search results, we used the following queries and measured precision @ 10 recommendations:

* frontend javascript
* data science python
* devops infrastructure

We documented our findings [here](https://docs.google.com/spreadsheets/d/1-DkfujZc6qVkG42upE_-XXvm2gTSTwqhBM8Nog3A8jg/edit?usp=sharing). That Google Sheet is accessible using UIUC logins. We noted the original order of the results against the resulting search order as well. Most of the results pulled from postings far below the default Hacker News ranking.

To facilitate the testing, we log the search results along with their original order in the console. Open the Chrome developer console and look for the log output "Ranked output from search." The objects printed after that are the search results and include their original order.
