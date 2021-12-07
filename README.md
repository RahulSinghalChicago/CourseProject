# CourseProject

## Project Documentation
Please see the PDF file above

## Testing

To test the search results, we used the following queries and measured precision @ 10 recommendations:

* frontend javascript
* data science python
* devops infrastructure

We documented our findings [here](https://docs.google.com/spreadsheets/d/1-DkfujZc6qVkG42upE_-XXvm2gTSTwqhBM8Nog3A8jg/edit?usp=sharing). That Google Sheet is accessible using UIUC logins. We noted the original order of the results against the resulting search order as well. Most of the results pulled from postings far below the default Hacker News ranking.

To facilitate the testing, we log the search results along with their original order in the console. Open the Chrome developer console and look for the log output "Ranked output from search." The objects printed after that are the search results and include their original order.
