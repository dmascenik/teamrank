package com.danmascenik.tools.teamrank;
import java.io.Console;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class TeamRank {

  private static final float BREAKOUT_PROBABILITY = 0.85f;
  private static boolean debug = false;

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
    Map<String,ArrayList<String>> voteMap = new HashMap<String,ArrayList<String>>();
    String voter = null;
    while (true) {
      voter = c.readLine("Enter voter name - or (d)one: ");
      if (voter == null || voter.trim().equals("")) {
        continue;
      }
      voter = voter.trim();
      if (voter.equals("d")) {
        break;
      }
      ArrayList<String> votes = voteMap.get(voter);
      if (votes == null) {
        votes = new ArrayList<String>();
        voteMap.put(voter, votes);
      }
      String vote = null;
      while (true) {
        vote = c.readLine("Cast vote - or (d)one: ");
        if (vote == null || vote.trim().equals("") || vote.trim().equals(voter)) {
          continue;
        }
        vote = vote.trim();
        if (vote.equals("d")) {
          break;
        }
        votes.add(vote);
      }
    }

    System.out.println();
    System.out.println("Computing TeamRank...");
    System.out.println();

    Map<String,Float> pageRank = pageRank(voteMap);

    for (String name : pageRank.keySet()) {
      Float rank = pageRank.get(name);
      System.out.println(name + ": " + rank);
    }
  }

  /**
   * Compute the ranking
   */
  private Map<String,Float> pageRank(Map<String,ArrayList<String>> voteMap) {
    String[] voters = extractVoters(voteMap);
    Map<String,Integer> voterRevIndex = indexVoters(voters);
    float[][] h = toSquareMatrix(voters, voterRevIndex, voteMap);

    if (debug) {
      for (int i = 0; i < voters.length; i++) {
        System.out.println(i + " = " + voters[i]);
      }
      printMatrix(h);
    }

    float[][] s = makeStochastic(h);

    if (debug) {
      System.out.println();
      printMatrix(s);
    }

    s = makeIrreducible(s);

    if (debug) {
      System.out.println();
      printMatrix(s);
    }

    float[] i = dominantEigenvector(s);

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
    validateSquareMatrix(s);
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

      if (debug) {
        StringBuffer sb = new StringBuffer("[");
        for (int i = 0; i < iout.length; i++) {
          sb.append(iout[i]);
          if (i != iout.length - 1) {
            sb.append(", ");
          }
        }
        sb.append("]");
        System.out.println(sb.toString());
      }

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
    validateSquareMatrix(m);
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
    validateSquareMatrix(in);
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
    validateSquareMatrix(in);
    float[][] out = new float[in.length][in.length];
    for (int x = 0; x < in.length; x++) {
      for (int y = 0; y < in.length; y++) {
        out[x][y] = in[x][y] * BREAKOUT_PROBABILITY + (1 - BREAKOUT_PROBABILITY) / in.length;
      }
    }
    return out;
  }

  public static void printMatrix(float[][] matrix) {
    StringBuffer sb = new StringBuffer();
    sb.append("\n\r");
    for (int y = 0; y < matrix.length; y++) {
      for (int x = 0; x < matrix.length; x++) {
        sb.append(matrix[x][y] + "  ");
      }
      sb.append("\n\r");
    }
    System.out.println(sb.toString());
  }

  private static void validateSquareMatrix(float[][] matrix) {
    if (matrix.length != matrix[0].length) {
      throw new IllegalArgumentException("matrix must be square");
    }
  }

}
