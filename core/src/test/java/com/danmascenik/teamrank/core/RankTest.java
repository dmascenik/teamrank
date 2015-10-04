package com.danmascenik.teamrank.core;

import static org.junit.Assert.assertEquals;

import java.util.Collections;
import java.util.List;

import org.junit.Test;

import com.danmascenik.teamrank.core.Rank;
import com.danmascenik.teamrank.core.Rank.RankComparator;
import com.google.common.collect.Lists;

public class RankTest {

  @Test
  public void testRankConstructor() {
    Rank<String> rank = new Rank<String>("a", 1f);
    assertEquals("a", rank.getId());
    assertEquals(1f, rank.getScore(), 0f);
  }

  @Test(expected = NullPointerException.class)
  public void testConstructorWithNullId() {
    new Rank<String>(null, 1f);
  }

  @Test
  public void testComparator() {
    @SuppressWarnings("unchecked")
    List<Rank<String>> ranks = Lists.newArrayList(new Rank<String>("a", 0f), new Rank<String>("b", 0f),
        new Rank<String>("c", -1f), new Rank<String>("d", 1f));
    Collections.sort(ranks, new RankComparator());
    assertEquals("d", ranks.get(0).getId());
    assertEquals("c", ranks.get(3).getId());
  }

}
