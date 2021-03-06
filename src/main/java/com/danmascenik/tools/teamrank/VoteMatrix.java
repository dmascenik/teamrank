package com.danmascenik.tools.teamrank;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

import com.danmascenik.tools.teamrank.Rank.RankComparator;

/**
 * A square matrix containing the raw data for a team rank calculation, encapsulating all the details of
 * transforming the matrix such that the power method will yield a stationary vector. New instances must be
 * constructed using the inner {@link Builder} class. <br/>
 * <br/>
 * Key assumptions to ensure convergence to a stationary vector:<br>
 * <br/>
 * <ol>
 * <li><b>The matrix must be stochastic</b>: This means that all the entries are non-negative and the sum of
 * the entries in each column is 1. Since a team member can only vote for another team member once, every
 * entry in the matrix is either zero or one. Simply dividing each entry by the number of non-zero entries in
 * the column ensures that the column adds up to one.<br/>
 * <br/>
 * But what if a column is all zeros? This happens when a team member didn't vote for anyone. <i>To make the
 * matrix stochastic, we will assume that voting for no one is the same as voting for everyone.</i><br/>
 * <br/>
 * </li>
 * <li><b>The matrix must be irreducible</b>: In order to guarantee that the power method will converge to a
 * single stationary vector regardless of the starting vector, there can't be any sub-groups whose votes only
 * come from their fellow members. However, cliques are inevitable even on modestly sized teams. Everyone
 * can't possibly know everything about everyone else. To make the matrix irreducible, we will assume that
 * <i>if a team member randomly selects another team member and gets to know them, there is some probability
 * that they will discover some positive influence, regardless of how they voted.</i> The probability that
 * positive influence will come from an unexpected source injects a probability factor to make the matrix
 * irreducible.</li>
 * </ol>
 *
 * @author Dan Mascenik
 * @param <T> The type used for voters'/votees' unique identifier (e.g. their name as a String, or a mapped
 * UUID). This type must be suitable for use as a key in a HashMap.
 */
public class VoteMatrix<T> {

  public static final float BREAKOUT_PROBABILITY = 0.15f;
  public static final int MAX_ITERATIONS = 1000;
  public static final float CONVERGENCE_MAX_DELTA = 0.0001f;

  private float[][] v;
  private float[][] a;
  private boolean hasVotes = false;
  private float bProb = BREAKOUT_PROBABILITY;
  private int iterationCount = -1;

  /**
   * Correlates voters'/votees' unique identifiers to indices on the axes of the square v.
   */
  private Map<T,Integer> indexMap = new HashMap<T,Integer>();

  /**
   * The reverse index of {@link #indexMap}
   */
  private Map<Integer,T> revIndex = new HashMap<Integer,T>();

  private VoteMatrix(Set<T> ids) {
    Objects.requireNonNull(ids);
    int size = ids.size();
    if (size == 0) {
      throw new IllegalArgumentException(VoteMatrix.class.getName() + " requires at least one voter");
    }
    v = new float[size][size];
    a = new float[size][size];
    int idx = 0;
    for (T id : ids) {
      indexMap.put(id, idx);
      revIndex.put(idx, id);
      idx++;
    }
  }

  private void putVote(T from, T to) {
    if (from.equals(to)) {
      return; // don't count self votes
    }
    int f = getVoterIndex(from);
    int t = getVoterIndex(to);
    v[f][t] = 1f;
    hasVotes = true;
  }

  private int getVoterIndex(T id) {
    if (!indexMap.keySet().contains(id)) {
      throw new IllegalArgumentException("Unknown voter: " + id);
    }
    return indexMap.get(id).intValue();
  }

  /**
   * Makes the provided square matrix stochastic by dividing every value by the number of non-zero values in
   * its column. For all-zero columns, set the value to the inverse of the number of rows in the matrix. This
   * means that if someone doesn't vote for anyone, it's the same as if they voted for everyone. This does not
   * affect the results of {@link #getVoters(Object)} or {@link #getVotes(Object)}
   */
  private void makeStochastic() {
    for (int from = 0; from < v.length; from++) {
      int count = 0;
      for (int to = 0; to < v.length; to++) {
        if (v[from][to] > 0.0f) {
          count++;
        }
      }
      for (int to = 0; to < v.length; to++) {
        if (count == 0.0f) {
          Arrays.fill(a[from], (float)(1.0f / (v.length - 1)));
          a[from][from] = 0;
        } else {
          v[from][to] = (float)(v[from][to] / count);
        }
      }
    }
  }

  /**
   * Votes may be cyclic, making the matrix reducible, thus not having a stationary vector. Since finding a
   * stationary vector (the dominant eigenvector) of the matrix is how we plan to get a rank, this is a
   * problem. This problem is overcome by introducing some probability that people will not strictly stick to
   * their votes. How do we get away with this? Even on a small team, everyone won't know everything about
   * everyone else. There is a chance that given the opportunity to learn more about any individual, they will
   * discover something that they find positive, whether they voted for that person or not. Larry Page and
   * Sergey Brin chose 15% for PageRank, so that is the default.
   *
   * @param bProb
   */
  public void setBreakoutProbability(float breakoutProbability) {
    if (!(breakoutProbability > 0f) || breakoutProbability > 1f) {
      throw new IllegalArgumentException(
          "Breakout probability must be greater than zero and less than or equal to one");
    }
    this.bProb = breakoutProbability;
  }

  public float getBreakoutProbability() {
    return this.bProb;
  }

  public float[] getDominantEigenvector() {
    /* Calculate the stochastic, irreducible matrix by adding v to a and introducing the probability factor to
     * the result. */
    float[][] g = new float[v.length][v.length];
    for (int from = 0; from < v.length; from++) {
      for (int to = 0; to < v.length; to++) {
        g[from][to] = (v[from][to] + a[from][to]) * (1 - bProb) + bProb / v.length;
      }
    }

    iterationCount = 0;

    // Initial vector of all ones
    float[] iin = new float[g.length];
    for (int i = 0; i < g.length; i++) {
      iin[i] = 1;
    }
    float[] iout = new float[g.length];

    /* Here's the power method in action. The stochastic, irreducible matrix is multiplied by the initial
     * vector of all 1's, resulting in another vector. The matrix is then multiplied by that vector. This
     * process continues until the result has converged on a stationary vector (the dominant eigenvector). */
    while (iterationCount < MAX_ITERATIONS && !converged(iin, iout)) {
      if (iterationCount != 0) {
        iin = iout;
      }
      iout = multiply(g, iin);
      iout = normalize(iout);
      iterationCount++;
    }
    return iout;
  }

  /**
   * Returns the ranking results as a sorted list of {@link Rank}s, with the highest first.
   *
   * @param usePercentages true will return the scores as percentages (adding up to 100%), otherwise raw
   * scores will be returned.
   */
  public List<Rank<T>> getResults(boolean usePercentages) {
    float[] i = getDominantEigenvector();
    float total = 0f;
    if (usePercentages) {
      for (float score : i) {
        total += score;
      }
    }
    List<Rank<T>> results = new ArrayList<Rank<T>>();
    for (int x = 0; x < i.length; x++) {
      float score = usePercentages ? i[x] / total : i[x];
      Rank<T> rank = new Rank<T>(getVoterForIndex(x), score);
      results.add(rank);
    }
    Collections.sort(results, new RankComparator());
    return results;
  }

  /**
   * Convenience method for {@link #getResults(boolean)} with usePercentages set to false.
   */
  public List<Rank<T>> getResults() {
    return getResults(false);
  }

  /**
   * Returns the number of iterations it took for the power method to converge the last time
   * {@link #getDominantEigenvector()} was called. If {@link #getDominantEigenvector()} has not yet been
   * called, this will return -1.
   */
  public int getIterationCount() {
    return this.iterationCount;
  }

  /**
   * Returns the identifiers of all the votes cast by the provided voter.
   *
   * @param id
   */
  public Set<T> getVotes(T id) {
    float[] row = v[getVoterIndex(id)];
    Set<T> votes = new HashSet<T>();
    for (int idx = 0; idx < row.length; idx++) {
      float v = row[idx];
      if (v > 0) {
        votes.add(revIndex.get(idx));
      }
    }
    return votes;
  }

  /**
   * Returns the identifiers of all those who voted for the provided team member.
   *
   * @param id
   */
  public Set<T> getVoters(T id) {
    int rcptIdx = getVoterIndex(id);
    Set<T> voters = new HashSet<T>();
    for (int idx = 0; idx < v.length; idx++) {
      float vote = v[idx][rcptIdx];
      if (vote > 0) {
        voters.add(revIndex.get(idx));
      }
    }
    return voters;
  }

  /**
   * Returns the raw value from the specified spot in the v
   *
   * @param from
   * @param to
   */
  public float valueAt(T from, T to) {
    int f = getVoterIndex(from);
    int t = getVoterIndex(to);
    return v[f][t] + a[f][t];
  }

  public T getVoterForIndex(int idx) {
    T voter = revIndex.get(idx);
    if (voter == null) {
      throw new IllegalArgumentException("Invalid index: " + idx);
    }
    return voter;
  }

  /**
   * Returns true if none of the array elements differ by more than 0.0001
   *
   * @param in
   * @param out
   * @return
   */
  protected static boolean converged(float[] in, float[] out) {
    if (in.length != out.length) {
      throw new IllegalArgumentException("input arrays must be of the same length");
    }
    for (int i = 0; i < in.length; i++) {
      float diff = in[i] - out[i];
      diff = Math.abs(diff);
      if (diff > CONVERGENCE_MAX_DELTA) {
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
  protected static float[] normalize(float[] v) {
    if (v.length == 0 || v[v.length - 1] == 0) {
      throw new IllegalArgumentException(
          "Vector to normalize must have a non-zero length and a non-zero last element");
    }
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
  protected static float[] multiply(float[][] m, float[] v) {
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
   * Constructs a {@link VoteMatrix} and inserts votes into it. Votes are idempotent; i.e., if one person
   * votes for another multiple times, it still only counts once.
   */
  public static class Builder<TT> {

    private VoteMatrix<TT> voteMatrix;
    private boolean isBuilt = false;

    /**
     * @param ids A set of unique identifiers for the team members
     */
    public Builder(Set<TT> ids) {
      Objects.requireNonNull(ids);
      voteMatrix = new VoteMatrix<TT>(ids);
    }

    public void castVote(TT from, TT to) {
      assertNotBuilt();
      voteMatrix.putVote(from, to);
    }

    public void validate(TT id) {
      voteMatrix.getVoterIndex(id);
    }

    /**
     * Convenience method for {@link #castVote(Object, Object)} that loops over multiple votes
     */
    public void castVotes(TT from, Set<TT> to) {
      for (TT t : to) {
        castVote(from, t);
      }
    }

    /**
     * Returns the completed {@link VoteMatrix} and prevents any further modifications.
     */
    public synchronized VoteMatrix<TT> build() {
      assertNotBuilt();
      isBuilt = true;
      if (!voteMatrix.hasVotes) {
        throw new IllegalStateException("Cannot build - v contains no votes!");
      }
      VoteMatrix<TT> m = voteMatrix;
      voteMatrix = null;

      m.makeStochastic();
      return m;
    }

    private synchronized void assertNotBuilt() {
      if (isBuilt) {
        throw new IllegalStateException(VoteMatrix.class.getName() + " was already built!");
      }
    }
  }
}
