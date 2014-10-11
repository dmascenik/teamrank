package com.danmascenik.tools.teamrank;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 * A square v containing the raw data for a team rank calculation. This class is immutable, so any v
 * transformations return a new instance. New instances must be constructed using the inner {@link Builder}
 * class.
 *
 * @author Dan Mascenik
 * @param <T> The type used for voters'/votees' unique identifier (e.g. their name as a String, or a mapped
 * UUID). This type must be suitable for use as a key in a HashMap.
 */
public class VoteMatrix<T> {

  private float[][] v;
  private float[][] a;
  private boolean hasVotes = false;
  private boolean isStochastic = false;
  private boolean isIrreducible = false;

  /**
   * Correlates voters'/votees' unique identifiers to indices on the axes of the square v.
   */
  private Map<T,Integer> indexMap = new HashMap<T,Integer>();

  /**
   * The reverse index of {@link #indexMap}
   */
  private Map<Integer,T> revIndex = new HashMap<Integer,T>();

  private VoteMatrix(Set<T> ids) {
    this(ids.size());
    int idx = 0;
    for (T id : ids) {
      indexMap.put(id, idx);
      revIndex.put(idx, id);
      idx++;
    }
  }

  private VoteMatrix(VoteMatrix<T> orig) {
    this(orig.indexMap.size());
    this.indexMap = orig.indexMap;
    this.revIndex = orig.revIndex;
    this.hasVotes = orig.hasVotes;
    this.isStochastic = orig.isStochastic;
    this.isIrreducible = orig.isIrreducible;
    for (int from = 0; from < orig.v.length; from++) {
      System.arraycopy(orig.v[from], 0, v[from], 0, orig.v.length);
    }
    for (int from = 0; from < orig.a.length; from++) {
      System.arraycopy(orig.a[from], 0, a[from], 0, orig.a.length);
    }
  }

  private VoteMatrix(int size) {
    if (size == 0) {
      throw new IllegalArgumentException(VoteMatrix.class.getName() + " requires at least one voter");
    }
    v = new float[size][size];
    a = new float[size][size];
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
  public VoteMatrix<T> makeStochastic() {
    VoteMatrix<T> out = new VoteMatrix<T>(this);
    for (int from = 0; from < this.v.length; from++) {
      int count = 0;
      for (int to = 0; to < this.v.length; to++) {
        if (this.v[from][to] > 0.0f) {
          count++;
        }
      }
      for (int to = 0; to < this.v.length; to++) {
        if (count == 0.0f) {
          if (from != to) {
            out.a[from][to] = (float)(1.0f / (this.v.length - 1));
          }
        } else {
          out.v[from][to] = (float)(this.v[from][to] / count);
        }
      }
    }
    out.isStochastic = true;
    return out;
  }

  /**
   * Votes may be cyclic, making the matrix reducible, thus not having a stationary vector. Since finding a
   * stationary vector (the dominant eigenvector) of the matrix is how we plan to get a rank, this is a
   * problem. This problem is overcome by introducing some probability that people will not strictly stick to
   * their votes. How do we get away with this? Even on a small team, everyone won't know everything about
   * everyone else. There is a chance that given the opportunity to learn more about any individual, they will
   * discover something that they find positive, whether they voted for that person or not. Larry Page and
   * Sergey Brin chose 15% for PageRank, and that may be a reasonable start here, too.
   *
   * @param breakoutProbability
   */
  public VoteMatrix<T> makeIrreducible(float breakoutProbability) {
    return null;
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

  public boolean isStochastic() {
    return this.isStochastic;
  }

  public boolean isIrreducible() {
    return this.isIrreducible;
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
      voteMatrix = new VoteMatrix<TT>(ids);
    }

    public void castVote(TT from, TT to) {
      assertNotBuilt();
      voteMatrix.putVote(from, to);
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
      return m;
    }

    private synchronized void assertNotBuilt() {
      if (isBuilt) {
        throw new IllegalStateException(VoteMatrix.class.getName() + " was already built!");
      }
    }
  }
}
