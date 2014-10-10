package com.danmascenik.tools.teamrank;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public class VoteMatrix<T> {

  private float[][] matrix;
  private Map<T,Integer> indexMap = new HashMap<T,Integer>();

  private VoteMatrix(Set<T> ids) {
    int size = ids.size();
    if (size == 0) {
      throw new IllegalArgumentException(VoteMatrix.class.getName() + " requires at least one voter");
    }
    matrix = new float[size][size];
    int idx = 0;
    for (T id : ids) {
      indexMap.put(id, idx);
      idx++;
    }

  }

  private void putVote(T from, T to) {
    int f = getVoterIndex(from);
    int t = getVoterIndex(to);
    matrix[f][t] = 1;
  }

  private int getVoterIndex(T id) {
    if (!indexMap.keySet().contains(id)) {
      throw new IllegalArgumentException("Unknown voter: " + id);
    }
    return indexMap.get(id).intValue();
  }

  /**
   *
   */
  public static class Builder<TT> {

    private VoteMatrix<TT> voteMatrix;
    private boolean isBuilt = false;

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
