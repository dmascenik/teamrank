package com.danmascenik.tools.teamrank;

import java.util.Comparator;

/**
 * Contains a team member's identifier and their score.
 *
 * @author danmascenik
 */
public class Rank<T> {

  private T id;
  private float score;

  public Rank(T id, float score) {
    if (id == null) {
      throw new IllegalArgumentException("id cannot be null");
    }
    this.id = id;
    this.score = score;
  }

  public T getId() {
    return this.id;
  }

  public float getScore() {
    return this.score;
  }

  public static class RankComparator implements Comparator<Rank<?>> {

    @SuppressWarnings("rawtypes")
    public int compare(Rank a, Rank b) {
      if (a.getScore() > b.getScore()) {
        return -1;
      } else if (a.getScore() < b.getScore()) {
        return 1;
      } else {
        return 0;
      }
    }

  }

}
