TeamRank
========
#### How to Quantitatively Rank a Team Based on "Positive Contribution"
###### ...and have it work whether you have 50 or 10,000 people!

by **Dan Mascenik**

At some time or another, every manager has to rank his or her team. It's a dangerous task, both to 
the culture of the team as well as the manager's credibility. Because of these risks, managers
tend to avoid ranking employees, but unfortunately, there are times when ranks are essential:
allocating bonuses, balancing teams, or (ugh) planning for a round of layoffs. Managers want to 
be objective, so they tend to rely on easily obtained productivity metrics - e.g, how many 
widgets did each person produce this year? Needless to say, this approach can miss a lot of the 
value that a person brings to the table. What about the person who is in the bottom 10% because 
he spent half his time mentoring new team members? Or what if your best producer hates the 
product and no one can stand working with him?

Good judgement has to be factored in somehow, but good managers are self-aware enough to recognize
that their judgement isn't perfect, that they can't always compensate for their biases, and may 
not even be conscious of all of them. Furthermore, they know they don't have all the data. Even 
with a modest-sized team of 60-70 people, it's practically impossible to get enough detail to 
avoid the use of buckets like these: 1) people who everyone knows are awesome, 2) people who seem 
pretty good, 3) people who no one talks about, and 4) people who have been complained about.

Most managers close their eyes, intone the executive mantra of **_good executives make tough 
decisions with incomplete information..._** and give it their best guess. They don't feel great 
about it, and when there are complaints (there are always complaints), their responses have to 
be evasive because the ranking was subjective. Okay, maybe it was obvious that the awesome team 
member would get the number 1 spot, or that "checked-out guy" would come in last, but they're 
never the ones lodging complaints.

#### There is a better way

What if you could **_quantitatively_** rank a team based on "positive contribution?" What if you 
didn't even have to figure out what that meant? *What if the team simply ranked itself?*

**TeamRank** is a simple tool for objectively and quantitatively scoring the positive influence 
of the members of a team. It's based on [Google's PageRank algorithm](http://www.ams.org/samplings/feature-column/fcarc-pagerank)
with a few tweaks added along the way. You may recall that PageRank ranks **_all the pages on the Internet_** by
relevance. Pages are considered more relevant if a lot of other pages link to them. Further, 
links from high-relevance pages like the main page of the New York Times carry more weight than 
links from, say, this page.

**TeamRank** works much the same way. If a lot of people think a team member makes a positive
contribution, that team member is ranked higher. If *that* team member thinks another team
member makes a positive contribution, his or her vote carries more weight. Because the algorithm
used was designed to rank *all the pages on the Internet*, given sufficient computing power,
it could work for a team larger than all of humanity by several multiples (though I haven't
personally verified this). It yields the expected result for teams as small as 2, though.

#How to Use#

Ask everyone to name a few people who they think make a positive contribution to the team. 
Leave it at that. It's fine to name none, but the maximum should be about 10% of the team size. The definition 
of "positive contribution" belongs to the individual. In a work environment, there is a natural 
bias toward productivity as a factor, but individuals will (and are welcomed to) include all 
their personal biases: "So-and-so is nice, and seeing them at work makes my day better" is 
perfectly legitimate. Happy people are more productive, and someone who contributes to a 
worker's happiness is indirectly driving productivity.

Data collection methods may vary depending on the purpose. You may need a snapshot, or you 
may want more of a time average. Depending on what you want, you could have everyone submit
names on the same day, or you could ask for names throughout the year. You could even have a
box that people can drop names into whenever they feel like it. It can't be anonymous,
though. You always have to know who is naming who as a positive contributor.

Tell the team what the algorithm is. This may seem to invite gaming, but unless the team has
a high proportion of malicious gamers, the results are actually quite positive. Openness is 
key to a good management relationship, but that's only part of the reason to share the algorithm.
**TeamRank** rewards those who have a strong positive influence on the team. It also rewards 
those who are recognized by those who have a strong positive influence on the team. Team 
members are encouraged to either **__be__** key people, or to **__find__** key people and 
**__convince__** them of the value of *their* positive contribution. I believe this is the 
desired behavior, even if the individuals themselves think it's a form of gaming. The algorithm
errs toward the mean, so if too many people play games, it will hurt the leaders. This tends
to keep the leaders honest.

######Edge Cases

If everyone names everyone else, everyone will get the same rank. If you were dividing up a
bonus pool, this would be the same as simply dividing by the number of people.

If no one names anyone as a positive contributor, the algorithm won't work. But that's 
probably the least of your problems at that point...

#When NOT to Use#

**TeamRank** will rank a team according to the *team's* collective sense of what a "positive
contribution" is. If you suspect the team's view is fundamentally different from yours, you
may want to consider a different ranking method.

I tested many scenarios in which some of the team members try to game the algorithm, and 
generally found that the system was self-policing. Gamers could not disrupt the overall 
ranking in any significant way. Human nature also comes into play. In order to elevate a
lower ranking individual, a potentially higher ranking individual would have to participate
in the gaming and knowingly forfeit some of their rank.

Of course, nothing is cheat-proof. If a larger proportion of the votes can be manipulated,
more of the ranking can be manipulated. If everyone is working together to game the algorithm,
it will be gamed - but congrats on the tight-knit team!


#Building and Running#
- git clone https://github.com/dmascenik/teamrank.git
- cd teamrank
- mvn clean install
- cd target/classes
- java TeamRank
