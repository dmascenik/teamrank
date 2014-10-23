package com.danmascenik.tools.teamrank;

import java.util.Comparator;
import java.util.Objects;

/**
 * Immutable class that contains a team member's identifier and their score.
 *
 * @author danmascenik
 */
public class Rank<T> {

  private final T id;
  private final float score;

  public Rank(T id, float score) {
    Objects.requireNonNull(id, "id cannot be null");
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
