package com.danmascenik.tools.teamrank;

import java.io.Console;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.danmascenik.tools.teamrank.VoteMatrix.Builder;

public class TeamRank {

  public static void main(String[] args) {
    Console c = System.console();
    if (c == null) {
      System.err.println("No console");
      System.exit(1);
    }
    new TeamRank().runFromConsole(c);
  }

  /**
   * Gather the necessary data from the console.
   */
  public void runFromConsole(Console c) {
    Set<String> teamMembers = new HashSet<String>();
    String teamMember = null;
    while (true) {
      teamMember = c.readLine("Enter a unique team member name - or (d)one: ");
      teamMember = teamMember.trim();
      if (teamMember.equals("")) {
        continue;
      }
      if (teamMember.equals("d")) {
        break;
      } else if (teamMembers.contains(teamMember)) {
        System.out.println(teamMember + " already added");
        continue;
      }
      teamMembers.add(teamMember);
    }
    Builder<String> b = new Builder<String>(teamMembers);
    String voter = null;
    while (true) {
      voter = c.readLine("Enter voter name - or (d)one: ");
      voter = voter.trim();
      if (voter.equals("")) {
        continue;
      }
      if (voter.equals("d")) {
        break;
      }
      try {
        b.validate(voter);
      } catch (Exception e) {
        System.out.println("Unknown team member: " + voter);
        continue;
      }
      String vote = null;
      while (true) {
        vote = c.readLine("Cast vote - or (d)one: ");
        vote = vote.trim();
        if (vote.equals("") || vote.equals(voter)) {
          continue;
        }
        if (vote.equals("d")) {
          break;
        }
        try {
          b.validate(vote);
        } catch (Exception e) {
          System.out.println("Unknown team member: " + voter);
          continue;
        }
        b.castVote(voter, vote);
      }
    }
    VoteMatrix<String> voteMatrix = b.build();

    System.out.println();
    System.out.println("Computing TeamRank...");

    List<Rank<String>> teamRank = voteMatrix.getResults(true);
    System.out.println("...converged after " + voteMatrix.getIterationCount() + " iterations.");
    System.out.println();

    for (Rank<String> rank : teamRank) {
      System.out.printf("%-10s %4.1f%%\n", rank.getId() + ":", (rank.getScore() * 100f));
    }
  }
}
