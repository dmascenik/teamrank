package com.danmascenik.tools.teamrank;

import java.io.Console;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import com.danmascenik.tools.teamrank.VoteMatrix.Builder;

public class TeamRank {

  public static void main(String[] args) {
    Console c = System.console();
    if (c == null) {
      System.err.println("No console");
      System.exit(1);
    }
    new TeamRank().start(c);
  }

  /**
   * Gather the necessary data from the console.
   */
  public void start(Console c) {
    Set<String> teamMembers = new HashSet<String>();
    String teamMember = null;
    while (true) {
      teamMember = c.readLine("Enter a unique team member name - or (d)one: ");
      if (teamMember == null || teamMember.trim().equals("")) {
        continue;
      }
      teamMember = teamMember.trim();
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
      if (voter == null || voter.trim().equals("")) {
        continue;
      }
      voter = voter.trim();
      try {
        b.validate(voter);
      } catch (Exception e) {
        System.out.println("Unknown team member: " + voter);
        continue;
      }
      if (voter.equals("d")) {
        break;
      }
      String vote = null;
      while (true) {
        vote = c.readLine("Cast vote - or (d)one: ");
        if (vote == null || vote.trim().equals("") || vote.trim().equals(voter)) {
          continue;
        }
        vote = vote.trim();
        try {
          b.validate(vote);
        } catch (Exception e) {
          System.out.println("Unknown team member: " + voter);
          continue;
        }
        if (vote.equals("d")) {
          break;
        }
        b.castVote(voter, vote);
      }
    }
    VoteMatrix<String> voteMatrix = b.build();

    System.out.println();
    System.out.println("Computing TeamRank...");
    System.out.println();

    Map<String,Float> pageRank = pageRank(voteMatrix);

    for (String name : pageRank.keySet()) {
      Float rank = pageRank.get(name);
      System.out.println(name + ": " + rank);
    }
  }

  /**
   * Compute the ranking
   */
  private Map<String,Float> pageRank(VoteMatrix<String> voteMatrix) {
    String[] voters = null;
    float[] i = voteMatrix.getDominantEigenvector();

    // Convert the raw ranking into percentages
    float total = 0.0f;
    for (int idx = 0; idx < i.length; idx++) {
      total += i[idx];
    }
    for (int idx = 0; idx < i.length; idx++) {
      i[idx] = i[idx] / total;
    }

    Map<String,Float> results = new HashMap<String,Float>();
    for (int idx = 0; idx < i.length; idx++) {
      results.put(voters[idx], i[idx]);
    }

    return results;
  }


}
