package com.danmascenik.tools.teamrank;

import java.io.Console;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.danmascenik.tools.teamrank.VoteMatrix.Builder;

public class TeamRank {

  private static final float BREAKOUT_PROBABILITY = 0.85f;

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
    float[] i = voteMatrix.dominantEigenvector();

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

  /**
   * Uses the power method to compute the dominant eigenvector of the provided matrix. This assumes that there
   * exists a single eigenvector whose eigenvalue is greater than the eigenvalue associated with any other
   * eigenvector of the matrix. The input matrix must be stochastic and irreducible. The condition for
   * convergence is the first four decimal places of each element of the eigenvector not changing from the
   * previous iteration. This will fail if the calculation does not converge after 1000 iterations.
   *
   * @param s
   * @return
   */
  public static float[] dominantEigenvector(float[][] s) {
    int iterations = 0;

    // Initial vector of all ones
    float[] iin = new float[s.length];
    for (int i = 0; i < s.length; i++) {
      iin[i] = 1;
    }
    float[] iout = new float[s.length];

    while (iterations < 1000 && !converged(iin, iout)) {
      if (iterations != 0) {
        iin = iout;
      }
      iout = multiply(s, iin);
      iout = normalize(iout);

      iterations++;
    }

    System.out.println("Converged after " + iterations + " iterations");

    return iout;
  }

  /**
   * Returns true if none of the array elements differ by more than 0.0001
   *
   * @param in
   * @param out
   * @return
   */
  public static boolean converged(float[] in, float[] out) {
    if (in.length != out.length) {
      throw new IllegalArgumentException("input arrays must be of the same length");
    }
    for (int i = 0; i < in.length; i++) {
      float diff = in[i] - out[i];
      diff = Math.abs(diff);
      if (diff > 0.0001) {
        return false;
      }
    }
    return true;
  }

  /**
   * Normalizes a vector by dividing each element by the value of the nth element, making the last element
   * equal to one.
   *
   * @param v
   * @return
   */
  public static float[] normalize(float[] v) {
    for (int i = 0; i < v.length; i++) {
      v[i] = v[i] / v[v.length - 1];
    }
    return v;
  }

  /**
   * Multiplies the matrix m by the vector v
   *
   * @param m
   * @param v
   * @return
   */
  public static float[] multiply(float[][] m, float[] v) {
    if (m.length != v.length) {
      throw new IllegalArgumentException("vector is not the same length as the square matrix");
    }
    float[] out = new float[v.length];
    for (int y = 0; y < m.length; y++) {
      float temp = 0;
      for (int x = 0; x < m.length; x++) {
        temp += v[x] * m[x][y];
      }
      out[y] = temp;
    }
    return out;
  }

  /**
   * Extract the unique voter/votee names from the vote mape and return them in as an array of strings.
   *
   * @param voteMap
   * @return
   */
  private static String[] extractVoters(Map<String,ArrayList<String>> voteMap) {
    Set<String> voters = new HashSet<String>();
    for (String voter : voteMap.keySet()) {
      voters.add(voter);
      ArrayList<String> votes = voteMap.get(voter);
      for (String vote : votes) {
        voters.add(vote);
      }
    }
    return voters.toArray(new String[0]);
  }

  /**
   * Creates a reverse map of the voter/votee name to their corresponding array index in the provided array.
   *
   * @param voters
   * @return
   */
  private static Map<String,Integer> indexVoters(String[] voters) {
    Map<String,Integer> voterIndex = new HashMap<String,Integer>();
    for (int i = 0; i < voters.length; i++) {
      voterIndex.put(voters[i], i);
    }
    return voterIndex;
  }

  /**
   * Converts the vote map into a square matrix where each element represents the number of votes from one
   * person to another. Each resulting cell with be an integer greater than or equal to zero.
   *
   * @param voters
   * @param voterRevIndex
   * @param voteMap
   * @return
   */
  private static float[][] toSquareMatrix(
      String[] voters,
      Map<String,Integer> voterRevIndex,
      Map<String,ArrayList<String>> voteMap) {

    int size = voters.length;
    float[][] h = new float[size][size];

    for (int voterId = 0; voterId < size; voterId++) {
      String fromVoter = voters[voterId];
      float[] voteRow = h[voterId];
      List<String> votes = voteMap.get(fromVoter);
      if (votes != null) {
        for (String vote : votes) {
          voteRow[voterRevIndex.get(vote).intValue()] += 1;
        }
      }
    }
    return h;
  }

  /**
   * Makes the provided square matrix stochastic by dividing every value by the number of non-zero values in
   * its column. For all-zero columns, set the value to the inverse of the number of rows in the matrix.
   *
   * @param in
   * @return
   */
  public static float[][] makeStochastic(float[][] in) {
    float[][] out = new float[in.length][in.length];

    for (int x = 0; x < in.length; x++) {
      int count = 0;
      for (int y = 0; y < in.length; y++) {
        if (in[x][y] < 0) {
          throw new IllegalArgumentException("matrix must have all non-negative values");
        }
        if (in[x][y] > 0.0f) {
          count++;
        }
      }

      for (int y = 0; y < in.length; y++) {
        if (count == 0.0f) {
          out[x][y] = (float)(1.0f / in.length);
        } else {
          out[x][y] = (float)(in[x][y] / count);
        }
      }
    }
    return out;
  }

  /**
   * Make the matrix irreducible by introducing a probability factor. What this actually means is that despite
   * anyone's vote, everyone has some characteristic that impresses someone else. If anyone approaches anyone
   * else randomly, they will probably discover something impressive about them. The
   * {@link BREAKOUT_PROBABILITY} is the likelihood that someone will strictly stick to their votes vs
   * discover something interesting about someone else at random.
   *
   * @param in
   * @return
   */
  public static float[][] makeIrreducible(float[][] in) {
    float[][] out = new float[in.length][in.length];
    for (int x = 0; x < in.length; x++) {
      for (int y = 0; y < in.length; y++) {
        out[x][y] = in[x][y] * BREAKOUT_PROBABILITY + (1 - BREAKOUT_PROBABILITY) / in.length;
      }
    }
    return out;
  }

}
